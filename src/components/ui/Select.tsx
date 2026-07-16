import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className = '', children, ...props }, ref) => {
    return (
      <div className="mb-3">
        <label className="mb-1 block text-sm text-text-secondary" htmlFor={id}>
          {label}
        </label>
        <select
          id={id}
          ref={ref}
          className={`w-full rounded-xl border border-border bg-surface-raised px-3 py-3 text-base text-text-primary outline-none focus:border-accent ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
