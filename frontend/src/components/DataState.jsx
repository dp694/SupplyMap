import StateMessage from "./StateMessage.jsx";

// Wraps the loading / error / empty branches used on every data-driven screen
// so pages only have to write the "happy path" render. Pass `skeleton` for a
// content-shaped placeholder instead of the generic spinner.
export default function DataState({ loading, error, isEmpty, emptyText, skeleton, children }) {
  if (loading) {
    return skeleton || <StateMessage kind="loading" title="Loading…" />;
  }

  if (error) {
    const isDbError = error.status === 503;
    return (
      <StateMessage
        kind="error"
        title={isDbError ? "Database unreachable" : "Something went wrong"}
        detail={error.message}
      />
    );
  }

  if (isEmpty) {
    return <StateMessage kind="empty" title={emptyText || "Nothing to show here."} />;
  }

  return children;
}
