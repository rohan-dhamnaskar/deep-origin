import { Sparkles } from 'lucide-react';

interface ToastProps {
  show: boolean;
  message: string;
}

export function Toast({ show, message }: ToastProps) {
  if (!show) return null;

  return (
    <div className="toast">
      <Sparkles className="toast__icon" />
      {message}
    </div>
  );
}
