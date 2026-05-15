/* Button reutilitzable amb variants: primary, outline, ghost, danger */
function Button({ children, variant = 'primary', size, full, disabled, onClick, type = 'button' }) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size ? `btn--${size}` : '',
    full ? 'btn--full' : '',
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

export default Button;
