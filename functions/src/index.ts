import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { Change } from 'firebase-functions';
// Use any for context if EventContext typing is problematic
// import { EventContext } from 'firebase-functions/lib/common/providers/events';

// Initialize Firebase Admin
admin.initializeApp();

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  functions.config().email.client_id,
  functions.config().email.client_secret,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: functions.config().email.refresh_token,
});

// Create a Nodemailer transporter using OAuth2
const createTransporter = async () => {
  const accessToken = await oauth2Client.getAccessToken();
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: functions.config().email.user,
      clientId: functions.config().email.client_id,
      clientSecret: functions.config().email.client_secret,
      refreshToken: functions.config().email.refresh_token,
      accessToken: accessToken.token!,
    },
  });
};

// Function to send email
const sendStatusUpdateEmail = async (to: string, name: string, status: string) => {
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);
  
  const mailOptions = {
    from: `"Baadaye Support" <${functions.config().email.user}>`,
    to: to,
    subject: `Your Application Status: ${statusText}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${name},</h2>
        <p>Your loan application status has been updated to: <strong>${statusText}</strong>.</p>
        <p>${getStatusMessage(status)}</p>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <br/>
        <p>Best regards,<br/>The Baadaye Team</p>
      </div>
    `,
  };

  try {
    const transporter = await createTransporter();
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} for status update: ${status}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// Helper function to get appropriate message based on status
const getStatusMessage = (status: string): string => {
  switch (status) {
    case 'approved':
      return 'Congratulations! Your loan application has been approved. Our team will contact you shortly with the next steps.';
    case 'rejected':
      return 'We regret to inform you that your loan application has been rejected. If you have any questions, please contact our support team.';
    case 'pending':
      return 'Your application is currently under review. We will notify you once there are any updates.';
    default:
      return 'Your application status has been updated.';
  }
};

// Use the v1 namespace for firestore triggers
const firestoreV1 = require('firebase-functions/v1').firestore;

// Cloud Function to trigger on application status update
export const onApplicationStatusUpdate = firestoreV1
  .document('applications/{applicationId}')
  .onUpdate(async (change: Change<FirebaseFirestore.DocumentSnapshot>, context: any) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    const applicationId = context.params.applicationId;

    // Null checks for beforeData and afterData
    if (!beforeData || !afterData) {
      console.error('Missing before or after data in Firestore trigger.');
      return null;
    }

    // Check if status was updated
    if (beforeData.status === afterData.status) {
      console.log('No status change detected, skipping...');
      return null;
    }

    console.log(`Status changed from ${beforeData.status} to ${afterData.status} for application ${applicationId}`);

    try {
      // Send email notification
      await sendStatusUpdateEmail(
        afterData.email,
        afterData.name,
        afterData.status
      );

      // Log the notification in Firestore
      await admin.firestore().collection('emailLogs').add({
        applicationId: applicationId,
        email: afterData.email,
        status: afterData.status,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Email notification sent for application ${applicationId}`);
      return null;
    } catch (error) {
      console.error('Error in onApplicationStatusUpdate:', error);
      // You might want to implement retry logic here
      return null;
    }
  });
