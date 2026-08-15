import { InboxIcon, AlertTriangleIcon } from "./icons.jsx";

const ICONS = {
  empty: InboxIcon,
  error: AlertTriangleIcon,
};

// Shared loading / empty / error placeholder so every screen looks consistent.
export default function StateMessage({ kind = "empty", title, detail }) {
  const Icon = ICONS[kind];

  return (
    <div className={`state-message state-message--${kind}`}>
      <span className="state-message__icon" aria-hidden="true">
        {kind === "loading" ? <span className="spinner" /> : <Icon width={22} height={22} />}
      </span>
      <p className="state-message__title">{title}</p>
      {detail && <p className="state-message__detail">{detail}</p>}
    </div>
  );
}
