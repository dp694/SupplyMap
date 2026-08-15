// Shared loading / empty / error placeholder so every screen looks consistent.
export default function StateMessage({ kind = "empty", title, detail }) {
  const icon = { loading: "⏳", empty: "📭", error: "⚠️" }[kind];

  return (
    <div className={`state-message state-message--${kind}`}>
      <span className="state-message__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="state-message__title">{title}</p>
      {detail && <p className="state-message__detail">{detail}</p>}
    </div>
  );
}
