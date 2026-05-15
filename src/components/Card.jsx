/* Card contenidor genèrica */
function Card({ children, title, icon, small }) {
  return (
    <div className={`card${small ? ' card--sm' : ''}`}>
      {title && (
        <div className="card__title">
          {icon && icon}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;
