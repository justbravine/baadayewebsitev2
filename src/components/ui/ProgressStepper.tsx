import { CheckCircle } from 'lucide-react';

type Step = {
  id: string;
  name: string;
  status: 'complete' | 'current' | 'upcoming';
};

interface ProgressStepperProps {
  steps: Step[];
  className?: string;
}

export function ProgressStepper({ steps, className = '' }: ProgressStepperProps) {
  return (
    <nav className={`w-full ${className}`} aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : 'flex-none'}`}
          >
            {step.status === 'complete' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-blue-600" />
                </div>
                <div className="group relative flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-900">
                  <CheckCircle className="h-5 w-5 text-white" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{step.name}</span>
                </div>
              </>
            ) : step.status === 'current' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div
                  className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600 bg-white dark:bg-slate-800"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{step.name}</span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="group relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-slate-800 hover:border-gray-400">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-500"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{step.name}</span>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
