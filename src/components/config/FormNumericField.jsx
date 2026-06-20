import React, { forwardRef } from 'react';

const FormNumericField = forwardRef(({ label, hint, error, ...props }, ref) => {
  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
      {hint && (
        <p className="text-xs text-slate-500 mb-2">
          {hint}
        </p>
      )}
      <input
        ref={ref}
        type="number"
        step="0.1"
        className={`
          w-full h-11 px-4 bg-white border rounded-xl font-mono text-sm text-slate-900 outline-none transition-all shadow-sm
          ${error 
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
            : 'border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10'}
        `}
        {...props}
      />
      {error && (
        <span className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          {error.message}
        </span>
      )}
    </div>
  );
});

FormNumericField.displayName = 'FormNumericField';
export default FormNumericField;
