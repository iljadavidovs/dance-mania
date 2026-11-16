import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ArrowUpRight, ArrowRight, MapPin, Mail, Phone } from "lucide-react";
import { contact, images, programs, documents } from "../domain/data";
import type { Variant, Program } from "../domain/data";
import { Button } from "./ui/button";
export const VariantContext = createContext<Variant>("interactive");
export const useVariant = () => useContext(VariantContext);
export const ResultContext = createContext<{
  completed: boolean;
  setCompleted: (v: boolean) => void;
}>({ completed: false, setCompleted: () => {} });
export function LocalLink({
  to,
  children,
  className,
  ...props
}: { to: string; children: ReactNode; className?: string } & Omit<
  React.ComponentProps<typeof Link>,
  "to"
>) {
  const v = useVariant();
  const location = useLocation();
  const target = `/${v}${to === "/" ? "" : `/${to}`}`;
  return (
    <Link
      to={target}
      aria-current={
        location.pathname === target.split("?")[0] ? "page" : undefined
      }
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}
export function Action({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Button asChild tone={secondary ? "secondary" : "primary"}>
      <LocalLink to={to}>
        {children}
        <ArrowRight size={18} aria-hidden="true" />
      </LocalLink>
    </Button>
  );
}
export function External({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a className="external-link" href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
      <span className="sr-only"> (external, opens a new tab)</span>
    </a>
  );
}
export function DanceImage({
  id,
  className = "",
  eager = false,
  caption = true,
}: {
  id: string;
  className?: string;
  eager?: boolean;
  caption?: boolean;
}) {
  const item = images.find((i) => i.id === id) || images[0];
  const [failed, setFailed] = useState(false);
  return (
    <figure className={`dance-image ${className}`}>
      {failed ? (
        <div className="image-unavailable" role="img" aria-label={item.alt}>
          Illustration unavailable. {item.title}
        </div>
      ) : (
        <img
          src={item.src}
          alt={item.alt}
          width="1400"
          height="1000"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          onError={() => setFailed(true)}
        />
      )}{" "}
      {caption && (
        <figcaption>Illustrative photograph • {item.title}</figcaption>
      )}
    </figure>
  );
}
export function PageHeading({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-heading">
      <LocalLink className="breadcrumb" to="/">
        Dance Mania School
      </LocalLink>
      <h1>{title}</h1>
      {intro && <p className="lead">{intro}</p>}
      {children}
    </header>
  );
}
export function Empty({
  children,
  reset,
}: {
  children: ReactNode;
  reset?: () => void;
}) {
  return (
    <div className="empty" role="status">
      <h2>No matches this time</h2>
      <p>{children}</p>
      {reset && (
        <Button tone="secondary" onClick={reset}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
export function useProgramFilters() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const audience = ["Children", "Adults"].includes(params.get("audience") || "")
    ? params.get("audience") || ""
    : "";
  const goal = ["Competitive", "Social", "Recreational"].includes(
    params.get("goal") || "",
  )
    ? params.get("goal") || ""
    : "";
  const style = ["Latin", "Standard", "Social"].includes(
    params.get("style") || "",
  )
    ? params.get("style") || ""
    : "";
  const update = (key: string, value: string) => {
    const n = new URLSearchParams(window.location.search);
    if (value) n.set(key, value);
    else n.delete(key);
    setParams(n, { replace: true });
  };
  const results = programs.filter(
    (p) =>
      (p.name + " " + p.dances.join(" ") + " " + p.summary)
        .toLowerCase()
        .includes(q.toLowerCase()) &&
      (!audience ||
        p.audience === audience ||
        p.audience === "Ask the school") &&
      (!goal || p.goal === goal) &&
      (!style || p.style.includes(style)),
  );
  return {
    q,
    audience,
    goal,
    style,
    update,
    results,
    reset: () => setParams({}),
    invalid: ["audience", "goal", "style"].some(
      (k) => params.has(k) && !{ audience, goal, style }[k as "audience"],
    ),
  };
}
export type ProgramFilterState = ReturnType<typeof useProgramFilters>;
export function ProgramFilters({
  state,
  compact = false,
}: {
  state: ProgramFilterState;
  compact?: boolean;
}) {
  return (
    <div className={`filters ${compact ? "compact" : ""}`}>
      <label>
        Search programs
        <input
          type="search"
          name="q"
          value={state.q}
          onChange={(e) => state.update("q", e.target.value)}
          placeholder="Try Rumba or social…"
        />
      </label>
      <label>
        Audience
        <select
          aria-label="Audience"
          value={state.audience}
          onChange={(e) => state.update("audience", e.target.value)}
        >
          <option value="">All audiences</option>
          <option>Children</option>
          <option>Adults</option>
        </select>
      </label>
      <label>
        Goal
        <select
          aria-label="Goal"
          value={state.goal}
          onChange={(e) => state.update("goal", e.target.value)}
        >
          <option value="">All goals</option>
          <option>Competitive</option>
          <option>Recreational</option>
          <option>Social</option>
        </select>
      </label>
      {!compact && (
        <label>
          Style
          <select
            aria-label="Style"
            value={state.style}
            onChange={(e) => state.update("style", e.target.value)}
          >
            <option value="">All styles</option>
            <option>Latin</option>
            <option>Standard</option>
            <option>Social</option>
          </select>
        </label>
      )}
      <Button tone="plain" onClick={state.reset}>
        Reset
      </Button>
      <p className="filter-count" role="status">
        {state.results.length} program families.{" "}
        {state.invalid ? "An unsupported filter was ignored. " : ""}Competitive
        age eligibility: ask the school.
      </p>
    </div>
  );
}
export function useDocumentFilters() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "",
    status = params.get("status") || "",
    period = params.get("period") || "",
    audience = params.get("audience") || "",
    type = params.get("type") || "";
  const update = (key: string, value: string) => {
    const n = new URLSearchParams(window.location.search);
    if (value) n.set(key, value);
    else n.delete(key);
    setParams(n, { replace: true });
  };
  const results = documents.filter(
    (d) =>
      (d.title + " " + d.audience).toLowerCase().includes(q.toLowerCase()) &&
      (!["current", "archive"].includes(status) ||
        (status === "archive") === d.archive) &&
      (!["2026–2027", "Summer 2026", "Undated"].includes(period) ||
        period === d.period) &&
      (!["Ages 4–25", "Age 25+", "Not specified"].includes(audience) ||
        audience === d.audience) &&
      (!["Classes", "Fees", "Camp"].includes(type) || type === d.type),
  );
  return {
    q,
    status,
    period,
    audience,
    type,
    update,
    results,
    reset: () => setParams({}),
  };
}
export function DocumentFilters({
  state,
}: {
  state: ReturnType<typeof useDocumentFilters>;
}) {
  return (
    <div className="filters document-filters">
      <label>
        Search documents
        <input
          type="search"
          value={state.q}
          onChange={(e) => state.update("q", e.target.value)}
          placeholder="Schedule or fees…"
        />
      </label>
      {(
        [
          {
            key: "status",
            label: "Time context",
            values: [
              ["current", "Current or undated"],
              ["archive", "Archive"],
            ],
          },
          {
            key: "period",
            label: "Period",
            values: ["2026–2027", "Summer 2026", "Undated"].map((s) => [s, s]),
          },
          {
            key: "audience",
            label: "Document audience",
            values: ["Ages 4–25", "Age 25+", "Not specified"].map((s) => [
              s,
              s,
            ]),
          },
          {
            key: "type",
            label: "Document type",
            values: ["Classes", "Fees", "Camp"].map((s) => [s, s]),
          },
        ] as const
      ).map((f) => (
        <label key={f.key}>
          {f.label}
          <select
            aria-label={f.label}
            value={state[f.key]}
            onChange={(e) => state.update(f.key, e.target.value)}
          >
            <option value="">All</option>
            {f.values.map(([v, t]) => (
              <option key={v} value={v}>
                {t}
              </option>
            ))}
          </select>
        </label>
      ))}
      <Button tone="plain" onClick={state.reset}>
        Reset
      </Button>
      <p role="status" className="filter-count">
        {state.results.length} documents
      </p>
      <details className="document-help">
        <summary>A document will not open?</summary>
        <p>
          The documents open in Google Drive. If a link is unavailable, ask the
          school for a copy using the contact options.
        </p>
        <LocalLink to="contact-us">Contact the school</LocalLink>
      </details>
    </div>
  );
}
export function ProgramFacts({ program }: { program: Program }) {
  return (
    <>
      <p>{program.summary}</p>
      <dl className="facts">
        <div>
          <dt>Purpose</dt>
          <dd>{program.goal}</dd>
        </div>
        <div>
          <dt>Audience</dt>
          <dd>{program.audience}</dd>
        </div>
        <div>
          <dt>Class times & fees</dt>
          <dd>Read source documents; confirm current arrangements</dd>
        </div>
      </dl>
      {program.dances.length ? (
        <ul className="dance-list">
          {program.dances.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ) : (
        <p>
          Dance styles and detailed eligibility are not specified on the source
          page.
        </p>
      )}
    </>
  );
}
export function ContactFacts() {
  return (
    <div className="contact-facts">
      <h2>Find us in Richmond Hill</h2>
      <p>
        <MapPin size={20} aria-hidden="true" />
        {contact.address}
      </p>
      <p>
        <Phone size={20} aria-hidden="true" />
        <a href="tel:+16472841546">Call Igor: {contact.phone}</a>
      </p>
      <p>
        <Mail size={20} aria-hidden="true" />
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
      </p>
      <External href="https://www.google.com/maps/search/?api=1&query=245+West+Beaver+Creek+Road+Unit+5A+Richmond+Hill">
        Open address in Google Maps
      </External>
      <p className="small">
        Owners: Igor Nikon & Yelena Nikon. Contact the school to arrange a
        visit; hours, parking and entrance details have not been verified.
      </p>
    </div>
  );
}
export function NextSteps() {
  return (
    <aside className="next-steps">
      <h2>Make the next step a clear one.</h2>
      <p>
        Explore a program, read the available documents, then ask the school
        about the right place to begin.
      </p>
      <Action to="schedule">Schedules & fees</Action>
      <Action to="register" secondary>
        Registration options
      </Action>
    </aside>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <LocalLink className="wordmark" to="/">
          Dance Mania<span>School</span>
        </LocalLink>
        <p>
          Ballroom & Latin American dance
          <br />
          Richmond Hill, Ontario
        </p>
      </div>
      <nav aria-label="Explore the school">
        {[
          ["programs", "Programs"],
          ["schedule", "Schedules & fees"],
          ["instructors", "Our people"],
          ["visit", "Plan a visit"],
          ["register", "Registration"],
        ].map(([to, t]) => (
          <LocalLink key={to} to={to}>
            {t}
          </LocalLink>
        ))}
      </nav>
      <nav aria-label="School archive and services">
        {[
          ["photos", "Photos"],
          ["videos-competitions", "Competition videos"],
          ["videos-shows", "Show videos"],
          ["events", "Events archive"],
          ["dance-mania-blog", "Journal"],
          ["dance-shoes-for-sale", "Dance shoes"],
          ["dance-clothes-for-sale-and-rent", "Dance clothing"],
          ["rent", "Studio hire"],
          ["contact-us", "Contact"],
          ["about-karls-aniscenko", "About the author"],
        ].map(([to, t]) => (
          <LocalLink key={to} to={to}>
            {t}
          </LocalLink>
        ))}
      </nav>
      <div className="footer-note">
        <p>
          Local design prototype. Illustrative photos are not school
          documentation. Forms are local demonstrations only.
        </p>
        <Link to="/provenance">Sources & image credits</Link>
        <Link to="/">Return to design gallery</Link>
      </div>
    </footer>
  );
}
