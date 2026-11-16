import { StrictMode, Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { articles, people, programs, variants } from "./domain/data";
import type { Variant } from "./domain/data";
import { ResultContext, VariantContext } from "./shared/core";
import Viewer from "./viewer/Viewer";
import "./base.css";
const Interactive = lazy(() => import("./variants/interactive"));
const Minimal = lazy(() => import("./variants/minimal"));
const Vision = lazy(() => import("./variants/vision"));
function Switcher({ variant, path }: { variant: Variant; path: string }) {
  const [visible, setVisible] = useState(true);
  const location = useLocation();
  return visible ? (
    <aside className="lab-switcher" aria-label="Design direction switcher">
      <Link to="/">Design gallery</Link>
      <nav aria-label="Switch design direction">
        {variants.map((v) => (
          <Link
            aria-current={variant === v.id ? "page" : undefined}
            key={v.id}
            to={`/${v.id}${path ? "/" + path : ""}${location.search}`}
          >
            {v.name}
          </Link>
        ))}
      </nav>
      <button
        aria-label="Dismiss design switcher"
        onClick={() => setVisible(false)}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </aside>
  ) : null;
}
function Experience({ variant, path }: { variant: Variant; path: string }) {
  const [completed, setCompleted] = useState(false);
  const Component =
    variant === "interactive"
      ? Interactive
      : variant === "minimal"
        ? Minimal
        : Vision;
  return (
    <VariantContext.Provider value={variant}>
      <ResultContext.Provider value={{ completed, setCompleted }}>
        <div className={`experience ${variant}`} data-variant={variant}>
          <a className="skip-link" href="#main">
            Skip to main content
          </a>
          <Switcher variant={variant} path={path} />
          <Suspense fallback={<p className="loading">Opening the school…</p>}>
            <Component path={path} key={path} />
          </Suspense>
          <div id={`${variant}-portal`} />
        </div>
      </ResultContext.Provider>
    </VariantContext.Provider>
  );
}
function App() {
  const location = useLocation();
  const segments = location.pathname
      .replace(/\/+$/, "")
      .split("/")
      .filter(Boolean),
    variant = segments[0] as Variant,
    path = segments.slice(1).join("/");
  useEffect(() => {
    const found =
      articles.find((a) => a.id === path)?.title ||
      people.find((p) => path === `instructors/${p.id}`)?.name ||
      programs.find((p) => path === `programs/${p.id}`)?.name ||
      path.split("/").at(-1)?.replaceAll("-", " ") ||
      "Home";
    document.title = variants.some((v) => v.id === variant)
      ? `${found.charAt(0).toUpperCase() + found.slice(1)} — Dance Mania | ${variants.find((v) => v.id === variant)?.name}`
      : "Dance Mania — redesign laboratory";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, path, variant]);
  return variants.some((v) => v.id === variant) ? (
    <Experience variant={variant} path={path} key={variant} />
  ) : (
    <Viewer path={location.pathname} />
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
