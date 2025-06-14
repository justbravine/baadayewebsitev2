import { motion, useMotionValue, useTransform } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineCurrencyDollar, HiOutlineClock } from 'react-icons/hi';

interface RequestCardProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  loanAmount: string;
  loanDuration: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date | { toDate: () => Date } | string | number;
  onStatusUpdate: (id: string, status: 'approved' | 'rejected' | 'pending') => void;
  isUpdating?: boolean;
}

const statusColors = {
  pending: {
    ring: 'from-yellow-400 to-yellow-200',
    glow: 'shadow-yellow-200/40',
    text: 'text-yellow-700',
    bg: 'bg-yellow-50',
  },
  approved: {
    ring: 'from-green-400 to-green-200',
    glow: 'shadow-green-200/40',
    text: 'text-green-700',
    bg: 'bg-green-50',
  },
  rejected: {
    ring: 'from-red-400 to-red-200',
    glow: 'shadow-red-200/40',
    text: 'text-red-700',
    bg: 'bg-red-50',
  },
};
const statusLabel = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

export function RequestCard({
  id,
  firstName,
  lastName,
  email,
  phone,
  location,
  loanAmount,
  loanDuration,
  status,
  submittedAt,
  onStatusUpdate,
  isUpdating,
}: RequestCardProps) {
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  // Parallax tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-30, 30], [8, -8]);
  const rotateY = useTransform(x, [-30, 30], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    x.set(((px / rect.width) - 0.5) * 60);
    y.set(((py / rect.height) - 0.5) * 60);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const formatDate = (dateValue: Date | { toDate: () => Date } | string | number) => {
    try {
      if (!dateValue) return 'N/A';
      if (typeof dateValue === 'object' && 'toDate' in dateValue) {
        return format(dateValue.toDate(), 'MMM d, yyyy h:mm a');
      }
      if (typeof dateValue === 'string' || typeof dateValue === 'number') {
        return format(new Date(dateValue), 'MMM d, yyyy h:mm a');
      }
      return 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY }}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: status === 'pending' ? 1 : 0.97,
        }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.45, type: 'spring', bounce: 0.18 }}
        className={cn(
          'relative group bg-gradient-to-br from-white/60 to-white/20 dark:from-slate-900/60 dark:to-slate-800/40 border border-white/30 dark:border-slate-800/60 shadow-2xl rounded-3xl overflow-visible',
          'hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.18)] transition-all duration-300',
          status !== 'pending' && 'opacity-80',
          'min-h-[260px] px-6 pt-12 pb-7 flex flex-col justify-between',
          'will-change-transform',
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glowing status ring */}
        <div className="absolute -top-7 -right-7 z-20">
          <div className={cn(
            'w-16 h-16 rounded-full bg-gradient-to-br',
            statusColors[status].ring,
            'flex items-center justify-center shadow-lg',
            statusColors[status].glow
          )}>
            <span className="block w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 border-2 border-white" />
          </div>
        </div>
        {/* Floating avatar */}
        <div className="absolute -top-10 left-7 z-20">
          <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-xl flex items-center justify-center border-4 border-white dark:border-slate-800 text-3xl font-extrabold text-primary">
            {firstName?.charAt(0) || 'U'}{lastName?.charAt(0) || 'U'}
          </div>
        </div>
        {/* Name and status */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2 mt-2">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-2xl text-foreground tracking-tight">
              {firstName} {lastName}
            </span>
            <span className={cn('ml-2 px-4 py-1 rounded-full text-xs font-bold border', statusColors[status].text, statusColors[status].bg, 'border-white/40 shadow-sm')}>{statusLabel[status]}</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono mt-1 md:mt-0">{formatDate(submittedAt)}</span>
        </div>
        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 mb-4">
          <div className="flex items-center gap-2 text-base font-medium text-slate-700 dark:text-slate-200">
            <HiOutlineMail className="text-primary" />
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-2 text-base font-medium text-slate-700 dark:text-slate-200">
            <HiOutlinePhone className="text-primary" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center gap-2 text-base font-medium text-slate-700 dark:text-slate-200">
            <HiOutlineLocationMarker className="text-primary" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-base font-bold text-primary">
            <HiOutlineCurrencyDollar className="text-primary" />
            <span>KSH {Number(loanAmount).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-base font-medium text-slate-700 dark:text-slate-200">
            <HiOutlineClock className="text-primary" />
            <span>{loanDuration} {Number(loanDuration) === 1 ? 'Day' : 'Days'}</span>
          </div>
        </div>
        {/* Floating action buttons */}
        <div className="flex gap-4 mt-4 justify-end">
          {status === 'pending' && (
            <>
              <motion.button
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.97, y: 1 }}
                onClick={() => onStatusUpdate(id, 'approved')}
                disabled={isUpdating}
                className="px-7 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-400 text-white font-bold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base"
              >
                {isUpdating ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                <span>Approve</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.97, y: 1 }}
                onClick={() => setShowRejectConfirm(true)}
                disabled={isUpdating}
                className="px-7 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-400 text-white font-bold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Reject</span>
              </motion.button>
            </>
          )}
          {status === 'rejected' && (
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.97, y: 1 }}
              onClick={() => onStatusUpdate(id, 'pending')}
              disabled={isUpdating}
              className="px-7 py-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-400 text-white font-bold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset to Pending</span>
            </motion.button>
          )}
        </div>
        {/* Rejection Confirmation Dialog */}
        <Transition appear show={showRejectConfirm} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setShowRejectConfirm(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-background p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-foreground"
                    >
                      Confirm Rejection
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        Are you sure you want to reject this loan application? This action can be undone later if needed.
                      </p>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        onClick={() => setShowRejectConfirm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        onClick={() => {
                          onStatusUpdate(id, 'rejected');
                          setShowRejectConfirm(false);
                        }}
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </motion.div>
    </>
  );
} 