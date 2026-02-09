import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

interface BackButtonProps {
  to?: string;
  label?: string;
  variant?: 'default' | 'ghost';
  className?: string;
}

function BackButton({ to, label = 'Back', variant = 'ghost', className = '' }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}

export default BackButton;
