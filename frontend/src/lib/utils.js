import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Password validation utilities
export const PASSWORD_REGEX = {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  MEDIUM: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
  // At least 6 characters
  WEAK: /^.{6,}$/
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push("Password must contain at least one special character (@$!%*?&)");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: errors.length === 0 ? 'strong' : errors.length <= 2 ? 'medium' : 'weak'
  };
};

export const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 'strong':
      return '#10B981'; // green
    case 'medium':
      return '#F59E0B'; // yellow
    case 'weak':
      return '#EF4444'; // red
    default:
      return '#6B7280'; // gray
  }
};

export const getPasswordStrengthText = (strength) => {
  switch (strength) {
    case 'strong':
      return 'Strong';
    case 'medium':
      return 'Medium';
    case 'weak':
      return 'Weak';
    default:
      return '';
  }
};
