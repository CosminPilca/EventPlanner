import { forwardRef } from 'react'

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  showError?: boolean
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { label, error, helperText, showError = true, className = '', ...props },
    ref
  ) => {
    const hasError = error && showError

    return (
      <div className="space-y-1">
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium text-theme-primary"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <input
          ref={ref}
          className={`
                        appearance-none relative block w-full px-3 py-2 rounded-md
                        placeholder-theme-muted text-theme-primary
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10
                        theme-transition text-sm
                        ${
                          hasError
                            ? 'border-2'
                            : 'border border-theme-primary focus:border-transparent'
                        }
                        ${className}
                    `}
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            ...(hasError && {
              borderColor: 'var(--color-destructive)',
              focusRingColor: 'var(--color-destructive)',
            }),
            ...(!hasError && {
              focusRingColor: 'var(--color-primary)',
            }),
          }}
          {...props}
        />

        {hasError && (
          <p className="text-sm" style={{ color: 'var(--color-destructive)' }}>
            {error}
          </p>
        )}

        {helperText && !hasError && (
          <p className="text-sm text-theme-muted">{helperText}</p>
        )}
      </div>
    )
  }
)

InputField.displayName = 'InputField'

export default InputField
