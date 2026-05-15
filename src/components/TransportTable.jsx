import Button from './Button';

/* Taula de transports disponibles amb botó Assignar */
function TransportTable({ transports, onAssign, canAssign }) {
  if (!transports || transports.length === 0) {
    return <p className="card__empty">No hi ha transports disponibles.</p>;
  }

  return (
    <div className="transport-table-wrapper">
      <table className="transport-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Origen</th>
            <th>Destí</th>
            <th>Càrrega</th>
            <th>Pes</th>
            <th>Data</th>
            <th>Estat</th>
            <th>Acció</th>
          </tr>
        </thead>
        <tbody>
          {transports.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.origin}</td>
              <td>{t.destination}</td>
              <td>{t.cargo}</td>
              <td>{t.weight}</td>
              <td>{t.date}</td>
              <td>
                <span className={`badge badge--${t.status}`}>
                  {t.status === 'pending' ? 'Pendent' : t.status}
                </span>
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!canAssign}
                  onClick={() => onAssign(t)}
                >
                  Assignar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransportTable;
