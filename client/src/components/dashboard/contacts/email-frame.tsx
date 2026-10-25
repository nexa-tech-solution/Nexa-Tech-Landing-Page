import { useState, type SyntheticEvent } from "react";

// Shows an email's HTML in an iframe sized to its content, so a short reply is not followed by
// a tall blank box. Scripts stay blocked; allow-same-origin is only there so the parent can read
// the rendered height (without allow-scripts the email still cannot run any code).
export function EmailFrame({ title, html, className = "" }: { title: string; html: string; className?: string }) {
  const [height, setHeight] = useState(160);

  const fit = (e: SyntheticEvent<HTMLIFrameElement>) => {
    const doc = e.currentTarget.contentDocument;
    if (doc) setHeight(Math.max(80, doc.documentElement.scrollHeight));
  };

  return (
    <iframe
      title={title}
      sandbox="allow-same-origin"
      srcDoc={html}
      onLoad={fit}
      style={{ height }}
      className={`block w-full bg-white ${className}`}
    />
  );
}
