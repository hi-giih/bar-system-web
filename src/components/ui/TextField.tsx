import { forwardRef, type InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    return (
      <div className="mb-3">
        <label className="mb-1 block text-sm text-text-secondary" htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={`w-full rounded-xl border border-border bg-surface-raised px-3 py-3 text-base text-text-primary placeholder-text-muted outline-none focus:border-accent ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    )
  },
)

TextField.displayName = 'TextField'
