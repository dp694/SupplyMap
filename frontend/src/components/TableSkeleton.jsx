// Placeholder rows shaped like the real supplier table, shown while it loads
// instead of a generic spinner - avoids the layout jump a spinner-then-table
// swap causes, and reads as considered rather than a stopgap.
export default function TableSkeleton({ rows = 6, columns = 4 }) {
  const widths = ["70%", "50%", "80%", "30%"];

  return (
    <div className="card card--glow">
      <table className="table">
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr className="skeleton-row" key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex}>
                  <div
                    className="skeleton-bar"
                    style={{ width: widths[colIndex % widths.length] }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
