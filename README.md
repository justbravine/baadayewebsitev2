# Baadaye Website

A modern web application for Baadaye, built with Next.js 14, Tailwind CSS, and Firebase. This platform serves as a comprehensive solution for managing applications and providing information about Baadaye's services.

## ✨ Features

- **Modern UI/UX**: Responsive design with smooth animations using Framer Motion
- **Admin Dashboard**: Secure area for managing applications and content
- **Application System**: User-friendly form with file uploads
- **Dark/Light Mode**: Built-in theme support
- **Real-time Updates**: Powered by Firebase Firestore
- **Secure Authentication**: Firebase Authentication for admin access

## 🚀 Tech Stack

- **Frontend**: 
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Framer Motion (animations)
  - React Hook Form with Zod validation

- **Backend & Services**:
  - Firebase Authentication
  - Firestore Database
  - Firebase Storage (for file uploads)
  - Next.js API Routes

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/justbravine/baadayewebsitev2.git
   cd baadayewebsitev2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory (App Router)
│   ├── admin/              # Admin routes
│   │   ├── dashboard/      # Admin dashboard
│   │   ├── login/          # Admin login
│   │   └── create-admin/   # Initial admin setup
│   ├── api/                # API routes
│   └── page.tsx            # Home page
├── components/             # Reusable UI components
│   ├── ui/                 # Shadcn/ui components
│   └── admin-layout/       # Admin layout components
├── contexts/               # React contexts
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and Firebase config
└── styles/                 # Global styles
```

## 🔧 Development

- **Code Style**: ESLint and Prettier configured for consistent code formatting
- **State Management**: React Context API for global state
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom theming
- **Authentication**: Firebase Authentication with protected routes

## 🚀 Deployment

The application can be deployed to:
- Vercel (Recommended for Next.js)
- Firebase Hosting
- Netlify

### Firebase Hosting Setup

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```

4. Deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
