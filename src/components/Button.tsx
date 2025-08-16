import React, { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'luxury' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
  loading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  loading = false, 
  className = '', 
  disabled,
  asChild = false,
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl focus:ring-blue-500 hover:-translate-y-0.5',
    secondary: 'bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 shadow-lg hover:shadow-xl focus:ring-slate-500 hover:-translate-y-0.5',
    outline: 'border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-500 shadow-md hover:shadow-lg',
    luxury: 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-900 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-700 shadow-xl hover:shadow-2xl focus:ring-amber-500 font-bold hover:-translate-y-1',
    ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500 rounded-lg'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm h-9',
    md: 'px-6 py-2.5 text-base h-11',
    lg: 'px-8 py-3 text-lg h-12',
    xl: 'px-10 py-4 text-xl h-14'
  };

  // If asChild is true, we expect children to be a single React element
  // This allows the button to wrap another component like Link
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      className: `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${child.props.className || ''}`,
      disabled: disabled || loading,
      ref,
      ...props,
      ...child.props,
    });
  }
  
  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : children}
    </button>
  );
});

Button.displayName = 'Button';
