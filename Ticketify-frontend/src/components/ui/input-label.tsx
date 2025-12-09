import * as React from "react"

interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  htmlFor?: string
}

const InputLabel = React.forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ children, htmlFor, className, ...props }, ref) => {
    return (
      <label
        htmlFor={htmlFor}
        ref={ref}
        className={`text-sm font-medium text-gray-700 ${className ?? ""}`}
        {...props}
      >
        {children}
      </label>
    )
  }
)

InputLabel.displayName = "InputLabel"

export { InputLabel }
