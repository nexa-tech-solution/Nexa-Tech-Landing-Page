import { Switch, Route, useLocation } from "wouter";
import { Suspense, lazy, useEffect, type ComponentType } from "react";

// One chunk per page. React.lazy suspends on first render even when the chunk
// is already cached, so once a page's module has loaded we render it directly.
function lazyPage(load: () => Promise<{ default: ComponentType }>) {
  let loaded: ComponentType | null = null;
  const loader = () =>
    load().then((mod) => {
      loaded = mod.default;
      return mod;
    });
  const Lazy = lazy(loader);
  function Page() {
    const Loaded = loaded;
    return Loaded ? <Loaded /> : <Lazy />;
  }
  return Object.assign(Page, { load: loader });
}

const Home = lazyPage(() => import("@/pages/Home"));
const Product = lazyPage(() => import("@/pages/Product"));
const Dashboard = lazyPage(() => import("@/pages/Dashboard"));
const Blog = lazyPage(() => import("@/pages/Blog"));
const Services = lazyPage(() => import("@/pages/Services"));
const BlogPost = lazyPage(() => import("@/pages/BlogPost"));
const ResetPassword = lazyPage(() => import("@/pages/ResetPassword"));
const Invite = lazyPage(() => import("@/pages/Invite"));
const Pricing = lazyPage(() => import("@/pages/Pricing"));
const ServiceDetail = lazyPage(() => import("@/pages/ServiceDetail"));
const Account = lazyPage(() => import("@/pages/Account"));
const Submit = lazyPage(() => import("@/pages/Submit"));
const Maker = lazyPage(() => import("@/pages/Maker"));
const AppDetail = lazyPage(() => import("@/pages/AppDetail"));
const Rankings = lazyPage(() => import("@/pages/Rankings"));
const Privacy = lazyPage(() => import("@/pages/Privacy"));
const Terms = lazyPage(() => import("@/pages/Terms"));
const NotFound = lazyPage(() => import("@/pages/not-found"));
const loaders = {
  home: Home.load,
  product: Product.load,
  dashboard: Dashboard.load,
  blog: Blog.load,
  services: Services.load,
  blogPost: BlogPost.load,
  rankings: Rankings.load,
  appDetail: AppDetail.load,
  maker: Maker.load,
  submit: Submit.load,
  account: Account.load,
  serviceDetail: ServiceDetail.load,
  pricing: Pricing.load,
  invite: Invite.load,
  resetPassword: ResetPassword.load,
  privacy: Privacy.load,
  terms: Terms.load,
  notFound: NotFound.load,
};

function loaderFor(pathname: string) {
  if (pathname === "/") return loaders.home;
  if (pathname.startsWith("/dashboard")) return loaders.dashboard;
  if (pathname.startsWith("/work/")) return loaders.product;
  if (pathname === "/services") return loaders.services;
  if (pathname.startsWith("/services/")) return loaders.serviceDetail;
  if (pathname === "/pricing") return loaders.pricing;
  if (pathname.startsWith("/invite/")) return loaders.invite;
  if (pathname === "/reset-password") return loaders.resetPassword;
  if (pathname === "/blog") return loaders.blog;
  if (pathname.startsWith("/blog/")) return loaders.blogPost;
  if (pathname.startsWith("/app/")) return loaders.appDetail;
  if (pathname.startsWith("/makers/")) return loaders.maker;
  if (pathname === "/submit") return loaders.submit;
  if (pathname === "/me") return loaders.account;
  if (pathname === "/rankings" || pathname.startsWith("/rankings/")) return loaders.rankings;
  if (pathname === "/privacy") return loaders.privacy;
  if (pathname === "/terms") return loaders.terms;
  return loaders.notFound;
}

// Warm the public page chunks once the browser is idle so later
// navigations never hit the Suspense fallback.
function usePreloadPages() {
  useEffect(() => {
    const preload = () =>
      [
        loaders.home,
        loaders.services,
        loaders.blog,
        loaders.rankings,
        loaders.blogPost,
        loaders.product,
      ].forEach((load) => void load().catch(() => {}));
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(preload, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(preload, 1500);
    return () => clearTimeout(id);
  }, []);
}

// Scrolls to `#hash` once the new page has rendered, or to the top otherwise.
// Retries for a few frames because the target section mounts after navigate().
function scrollAfterNavigate(hash: string) {
  let frames = 0;
  const run = () => {
    const target = hash
      ? document.getElementById(decodeURIComponent(hash.slice(1)))
      : null;
    if (target) {
      target.scrollIntoView({
        behavior: "instant" as ScrollBehavior,
        block: "start",
      });
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

      // Load the next page's chunk first so the current page stays on screen
      // instead of flashing the empty Suspense fallback.
      const go = () => {
        navigate(url.pathname + url.search + url.hash);
        scrollAfterNavigate(url.hash);
      };
      loaderFor(url.pathname)().then(go, go);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);
}

function Router() {
  const [location] = useLocation();
  useClientSideLinks();
  usePreloadPages();

  // Dashboard tabs are one screen; don't replay the entrance when switching them.
  const pageKey = location.startsWith("/dashboard") ? "/dashboard" : location;

  return (
    // Opacity only: a transform here would re-anchor the fixed chat button
    // mid-fade. Reduced motion is handled by the global CSS rule.
    <div key={pageKey} className="page-enter">
      <Suspense fallback={null}>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/dashboard/settings" component={Dashboard} />
          <Route path="/dashboard/contacts" component={Dashboard} />
          <Route path="/work/:slug" component={Product} />
          <Route path="/services" component={Services} />
          <Route path="/services/:slug" component={ServiceDetail} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/invite/:token" component={Invite} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/app/:slug" component={AppDetail} />
          <Route path="/makers/:slug" component={Maker} />
          <Route path="/submit" component={Submit} />
          <Route path="/me" component={Account} />
          <Route path="/rankings" component={Rankings} />
          <Route path="/rankings/:category" component={Rankings} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </div>
  );
}

function App() {
  return <Router />;
}

export default App;
