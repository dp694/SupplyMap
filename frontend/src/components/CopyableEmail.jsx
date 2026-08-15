import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons.jsx";

export default function CopyableEmail({ email }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable - nothing to fall back to that isn't insecure.
    }
  };

  return (
    <span className="copyable">
      <span className="copyable__text">{email}</span>
      <button
        type="button"
        className={`copyable__button${copied ? " copyable__button--copied" : ""}`}
        onClick={handleCopy}
        aria-label={`Copy ${email}`}
        title="Copy email"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        {copied && <span className="copyable__tooltip">Copied</span>}
      </button>
    </span>
  );
}
