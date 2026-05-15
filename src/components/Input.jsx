/* Input reutilitzable amb icona a l'esquerra i icona opcional a la dreta */
function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  iconRight,
  error,
  name,
  accept,
  noIcon,
}) {
  return (
    <div className="input-group">
      {label && <label htmlFor={name}>{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          accept={accept}
          className={[
            'input-field',
            error ? 'input-field--error' : '',
            noIcon ? 'no-icon' : '',
          ].filter(Boolean).join(' ')}
        />
        {iconRight && <button type="button" className="input-icon-right">{iconRight}</button>}
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
}

export default Input;
