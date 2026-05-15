/* Alert d'estat: error, success, info */
function Alert({ type = 'info', message, icon }) {
  return (
    <div className={`alert alert--${type}`}>
      {icon && icon}
      <span>{message}</span>
    </div>
  );
}

export default Alert;
