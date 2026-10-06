import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import Home from "@/pages/Home";
import Product from "@/pages/Product";
import Dashboard from "@/pages/Dashboard";
import Blog from "@/pages/Blog";
import Services from "@/pages/Services";
import BlogPost from "@/pages/BlogPost";
import NotFound from "@/pages/not-found";

// Scrolls to `#hash` once the new page has rendered, or to the top otherwise.
// Retries for a few frames because the target section mounts after navigate().
function scrollAfterNavigate(hash: string) {
  let frames = 0;
  const run = () => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) {
      target.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
    } else if (hash && frames++ < 20) {
      requestAnimationFrame(run);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  };
  requestAnimationFrame(run);
}

// Pages use plain <a href> everywhere. Turn same-origin clicks into client-side
// navigations so moving between pages never reloads (and never flashes).
function useClientSideLinks() {
  const [, navigate] = useLocation();

  // A cold load of /#contact: the browser tried to jump before React rendered.
  useEffect(() => {
    if (window.location.hash) scrollAfterNavigate(window.location.hash);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const link = (event.target as Element | null)?.closest?.("a");
      if (!link || !link.href || link.hasAttribute("download")) return;
      if (link.target && link.target !== "_self") return;

      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;
      // Static files in /public (privacy pages, ads.txt…) must load for real.
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return;

      event.preventDefault();
      const samePage =
        url.pathname === window.location.pathname &&
        url.search === window.location.search;

      if (samePage) {
        if (url.hash) {
          window.history.pushState(null, "", url.hash);
          document
            .getElementById(decodeURIComponent(url.hash.slice(1)))
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      navigate(url.pathname + url.search + url.hash);
      scrollAfterNavigate(url.hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);
}

function Router() {
  const [location] = useLocation();
  useClientSideLinks();

  // Dashboard tabs are one screen; don't replay the entrance when switching them.
  const pageKey = location.startsWith("/dashboard") ? "/dashboard" : location;

  return (
    // Opacity only: a transform here would re-anchor the fixed chat button
    // mid-fade. Reduced motion is handled by the global CSS rule.
    <div key={pageKey} className="page-enter">
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/dashboard/settings" component={Dashboard} />
        <Route path="/work/:slug" component={Product} />
        <Route path="/services" component={Services} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return <Router />;
}

export default App;
