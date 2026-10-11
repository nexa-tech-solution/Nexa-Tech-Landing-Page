import { createRoot, hydrateRoot } from "react-dom/client";
import { Router } from "wouter";
import { Analytics } from "@vercel/analytics/react";
import { QueryClientProvider, hydrate } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/query-client";
import App from "./App";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/mona-sans/wght.css";
import "./index.css";

declare global {
  interface Window {
    __REACT_QUERY_STATE__?: unknown;
  }
}

// Keep this tree identical to entry-server.tsx so useId() values line up on hydration.
// Pre-rendered pages (scripts/prerender.ts) ship their query cache so the first
// client render matches the static HTML.
if (window.__REACT_QUERY_STATE__) {
  hydrate(queryClient, window.__REACT_QUERY_STATE__);
}

const container = document.getElementById("root")!;
const tree = (
  <QueryClientProvider client={queryClient}>
    <Router>
      <App />
    </Router>
    <Analytics />
  </QueryClientProvider>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
