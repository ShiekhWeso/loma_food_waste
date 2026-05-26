function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon,
  className = '',
  ...props
}) {
  return (
    <div className={`form-field ${className}`}>
      <label className="form-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="form-field__control">
        {icon && <span className="material-symbols-outlined form-field__icon">{icon}</span>}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={icon ? 'form-field__input form-field__input--icon' : 'form-field__input'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p className="form-field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
