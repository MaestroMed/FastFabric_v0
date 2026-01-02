import { Check } from 'lucide-react';
import { cn } from '~/lib/utils';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

interface Step {
  id: number;
  name: string;
  description: string;
  path?: string;
}

interface FormProgressProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

const stepPaths: Record<number, string> = {
  1: '/commander',
  2: '/commander/projet',
  3: '/commander/contenu',
  4: '/commander/paiement',
};

export function FormProgress({ steps, currentStep, onStepClick }: FormProgressProps) {
  const navigate = useNavigate();

  const handleStepClick = (step: Step) => {
    // Only allow going back to completed steps
    if (step.id < currentStep) {
      // Check if session data exists for this step
      const hasStep1 = sessionStorage.getItem('ff_order_step1');
      
      if (step.id === 1) {
        navigate(stepPaths[1]);
      } else if (step.id === 2 && hasStep1) {
        navigate(stepPaths[2]);
      } else if (step.id === 3 && hasStep1 && sessionStorage.getItem('ff_order_step2')) {
        navigate(stepPaths[3]);
      }
      
      onStepClick?.(step.id);
    }
  };

  return (
    <nav aria-label="Progression du formulaire" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;
          const isClickable = isCompleted;

          return (
            <li key={step.id} className="relative flex-1">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 origin-left",
                    "bg-[var(--accent)]"
                  )} 
                />
              )}
              {index < steps.length - 1 && (
                <div 
                  className="absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 bg-gray-200 -z-10" 
                />
              )}

              <motion.div 
                className={cn(
                  "flex flex-col items-center relative",
                  isClickable && "cursor-pointer group"
                )}
                onClick={() => handleStepClick(step)}
                whileHover={isClickable ? { scale: 1.05 } : undefined}
                whileTap={isClickable ? { scale: 0.95 } : undefined}
              >
                {/* Step circle */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                    isCompleted && "bg-[var(--accent)] text-white group-hover:ring-4 group-hover:ring-blue-100",
                    isCurrent && "bg-[var(--accent)] text-white ring-4 ring-blue-100",
                    isUpcoming && "bg-gray-100 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {step.id}
                    </motion.span>
                  )}
                </motion.div>

                {/* Step text */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isCurrent && "text-[var(--accent)]",
                      isCompleted && "text-gray-700 group-hover:text-[var(--accent)]",
                      isUpcoming && "text-gray-400"
                    )}
                  >
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-400 hidden sm:block">
                    {step.description}
                  </p>
                </div>

                {/* Clickable hint for completed steps */}
                {isCompleted && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute -bottom-6 text-xs text-[var(--accent)] whitespace-nowrap"
                  >
                    Modifier
                  </motion.span>
                )}
              </motion.div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
