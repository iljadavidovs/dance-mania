import { useState } from "react";
import { Menu, X, ChevronDown, ArrowUpRight, Plus } from "lucide-react";
import {
  articles,
  documentNotes,
  dateLabel,
  documents,
  people,
  programs,
} from "../domain/data";
import {
  Action,
  ContactFacts,
  DanceImage,
  DocumentFilters,
  Empty,
  External,
  Footer,
  LocalLink,
  NextSteps,
  PageHeading,
  ProgramFacts,
  ProgramFilters,
  useDocumentFilters,
  useProgramFilters,
} from "../shared/core";
import { Button } from "../shared/ui/button";
import { Modal } from "../shared/ui/dialog";
import { DemoForm } from "../shared/forms";
import { Gallery, VideoArchive } from "../shared/media";
import {
  ArticleBody,
  ArticleMeta,
  PersonNote,
  inquiryIntro,
} from "../shared/pages";
import RhythmSupplement from "./interactive-supplement";
import "./interactive.css";
export function Header() {
  const [open, setOpen] = useState(false);
  const [programOpen, setProgramOpen] = useState(false);
  return (
    <header className="rhythm-header">
      <LocalLink to="/" className="wordmark">
        Dance Mania<span>Ballroom & Latin American dance</span>
      </LocalLink>
      <button
        className="menu-button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="rhythm-navigation"
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />} Menu
      </button>
      <nav
        id="rhythm-navigation"
        className={open ? "open" : ""}
        aria-label="Main navigation"
      >
        <div className="nav-disclosure">
          <button
            aria-expanded={programOpen}
            onClick={() => setProgramOpen(!programOpen)}
          >
            Learn to dance <ChevronDown size={16} aria-hidden="true" />
          </button>
          {programOpen && (
            <div className="program-menu">
              <LocalLink to="programs" onClick={() => setOpen(false)}>
                Browse all programs
              </LocalLink>
              {programs.map((p) => (
                <LocalLink
                  key={p.id}
                  to={`programs/${p.id}`}
                  onClick={() => setOpen(false)}
                >
                  {p.name}
                </LocalLink>
              ))}
            </div>
          )}
        </div>
        {[
          ["schedule", "Schedules & fees"],
          ["instructors", "Our people"],
          ["photos", "Explore"],
          ["contact-us", "Contact"],
        ].map(([to, t]) => (
          <LocalLink key={to} to={to} onClick={() => setOpen(false)}>
            {t}
          </LocalLink>
        ))}
        <Action to="register">Find your start</Action>
      </nav>
    </header>
  );
}
function Home() {
  const state = useProgramFilters();
  return (
    <>
      <section className="rhythm-hero">
        <div className="rhythm-hero-copy">
          <p className="location-label">Dance Mania School • Richmond Hill</p>
          <h1>
            Find your rhythm.
            <br />
            Make it yours.
          </h1>
          <p className="lead">
            Ballroom and Latin American dance, from a first step to the
            competition floor.
          </p>
          <Action to="programs">Explore the programs</Action>
          <LocalLink className="text-link" to="visit">
            New here? Plan your first visit
          </LocalLink>
        </div>
        <div className="rhythm-frames">
          <DanceImage id="latin" eager />
          <DanceImage id="tango" eager />
          <span className="frame-note">
            In partnership.
            <br />
            In your own way.
          </span>
        </div>
      </section>
      <section className="rhythm-finder">
        <div>
          <h2>Where would you like to begin?</h2>
          <p>Choose an interest. Keep your options open.</p>
        </div>
        <ProgramFilters state={state} compact />
        <div className="finder-results">
          {state.results.map((p) => (
            <LocalLink key={p.id} to={`programs/${p.id}`}>
              {p.name}
              <ArrowUpRight aria-hidden="true" size={18} />
            </LocalLink>
          ))}
          {!state.results.length && (
            <Empty reset={state.reset}>
              Try a different dance or audience.
            </Empty>
          )}
        </div>
        <LocalLink to="programs">Browse all four program families</LocalLink>
      </section>
      <section className="rhythm-program-home">
        <div>
          <h2>Four ways onto the floor.</h2>
          <p>
            Group lessons, private lessons, workshops, competitions and shows
            form part of the school’s offer. Ask about current arrangements.
          </p>
        </div>
        {programs.map((p) => (
          <LocalLink
            className="rhythm-program-tile"
            key={p.id}
            to={`programs/${p.id}`}
          >
            <span>{p.goal}</span>
            <h3>{p.name}</h3>
            <p>
              {p.dances.slice(0, 3).join(", ") ||
                "A recreational route for children"}
            </p>
            <ArrowUpRight aria-hidden="true" />
          </LocalLink>
        ))}
      </section>
      <section className="rhythm-people-home">
        <DanceImage id="jive" />
        <div>
          <h2>A school is a meeting of people.</h2>
          <p>
            Meet the teachers and instructors behind Dance Mania. Start with the
            names, then ask about the right teaching fit.
          </p>
          <p className="name-line">
            Igor Nikon • Yelena Nikon • Dayana Nikon • Karls Aniscenko
          </p>
          <Action to="instructors">Meet all ten people</Action>
        </div>
      </section>
      <section className="rhythm-media-home">
        <h2>
          See the movement.
          <br />
          Read the stories.
        </h2>
        <div>
          <Action to="photos">Explore photographs</Action>
          <Action to="videos-competitions" secondary>
            Watch the archive
          </Action>
          <LocalLink className="text-link" to="dance-mania-blog">
            Read six stories from 2020
          </LocalLink>
        </div>
      </section>
      <section className="home-documents">
        <h2>The practical part.</h2>
        {documents.slice(0, 3).map((d) => (
          <LocalLink
            key={d.id}
            to={`schedule?q=${d.type === "Fees" ? "fee" : "2026"}`}
          >
            <span>{d.audience}</span>
            <h3>{d.title}</h3>
            <ArrowUpRight aria-hidden="true" />
          </LocalLink>
        ))}
      </section>
      <div className="home-visit">
        <ContactFacts />
        <NextSteps />
      </div>
    </>
  );
}
function Programs() {
  const state = useProgramFilters();
  const [compare, setCompare] = useState<string[]>([]);
  return (
    <>
      <PageHeading
        title="Find your way to dance."
        intro="Explore four program families. Compare the dances and purpose; ask us about detailed eligibility."
      />
      <ProgramFilters state={state} />
      {state.results.length ? (
        <div className="rhythm-programs">
          {state.results.map((p) => (
            <article key={p.id}>
              <DanceImage id={p.image} />
              <div>
                <span className="status-label">{p.goal}</span>
                <h2>{p.name}</h2>
                <ProgramFacts program={p} />
                <div className="actions">
                  <Action to={`programs/${p.id}`}>Explore program</Action>
                  <Button
                    tone="secondary"
                    aria-pressed={compare.includes(p.id)}
                    onClick={() =>
                      setCompare((c) =>
                        c.includes(p.id)
                          ? c.filter((i) => i !== p.id)
                          : [...c, p.id],
                      )
                    }
                  >
                    <Plus aria-hidden="true" size={16} />
                    {compare.includes(p.id) ? "Remove comparison" : "Compare"}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty reset={state.reset}>
          No program matches those choices. Clear filters to see all four
          families.
        </Empty>
      )}
      {compare.length > 0 && (
        <section className="comparison" aria-label="Program comparison">
          <h2>Your program comparison</h2>
          <div>
            {programs
              .filter((p) => compare.includes(p.id))
              .map((p) => (
                <article key={p.id}>
                  <h3>{p.name}</h3>
                  <p>
                    {p.goal} • {p.audience}
                  </p>
                  <p>
                    {p.dances.join(", ") || "Detailed styles: ask the school"}
                  </p>
                  <LocalLink to={`programs/${p.id}`}>Program details</LocalLink>
                </article>
              ))}
          </div>
          <Button tone="secondary" onClick={() => setCompare([])}>
            Clear comparison
          </Button>
        </section>
      )}
    </>
  );
}
function Schedule() {
  const state = useDocumentFilters();
  return (
    <>
      <PageHeading
        title="Make space for dance."
        intro="The school’s schedule and fee documents, brought into one clear place."
      />
      <div className="schedule-notice">
        <strong>Documents, not a live timetable.</strong> Documents reviewed
        November 16, 2026. Source labels and readable pages are summarized
        below; current operation and places need confirmation. Age 25 appears in
        both source audience labels.
      </div>
      <DocumentFilters state={state} />
      {state.results.length ? (
        <div className="document-board">
          {state.results.map((d) => (
            <article key={d.id}>
              <span className="status-label">
                {d.archive
                  ? "Archive"
                  : d.period === "Undated"
                    ? "Date unknown"
                    : "Current period"}{" "}
                • {d.type}
              </span>
              <h2>{d.title}</h2>
              <p>{d.audience}</p>
              <p className="small">{documentNotes[d.id]}</p>
              <External href={d.url}>Open original document</External>
              <details>
                <summary>About this source</summary>
                <p>
                  Listed by the school. Period labels do not confirm class
                  operation or places. Opens Google Drive; external access may
                  vary.
                </p>
              </details>
            </article>
          ))}
        </div>
      ) : (
        <Empty reset={state.reset}>
          Try a broader period, audience or document type.
        </Empty>
      )}
      <NextSteps />
    </>
  );
}
function People() {
  const [quick, setQuick] = useState<string | null>(null);
  const person = people.find((p) => p.id === quick);
  return (
    <>
      <PageHeading
        title="People make the rhythm."
        intro="Six teachers. Four instructors. One source-backed introduction to the school’s people."
      />
      {["Teacher", "Instructor"].map((role) => (
        <section className="rhythm-people" key={role}>
          <h2>{role === "Teacher" ? "Teachers" : "Instructors"}</h2>
          <div>
            {people
              .filter((p) => p.role === role)
              .map((p) => (
                <article key={p.id}>
                  <div className="initials">{p.initials}</div>
                  <p>{p.role}</p>
                  <h3>
                    <LocalLink to={`instructors/${p.id}`}>{p.name}</LocalLink>
                  </h3>
                  <Button tone="plain" onClick={() => setQuick(p.id)}>
                    Quick view
                  </Button>
                </article>
              ))}
          </div>
        </section>
      ))}
      <Modal
        placement="drawer"
        variant="interactive"
        open={!!person}
        onOpenChange={(v) => !v && setQuick(null)}
        title={person?.name || "Person"}
      >
        {person && (
          <>
            <p>{person.role} — source listing</p>
            <PersonNote />
            <Action to={`instructors/${person.id}`}>Full detail page</Action>
          </>
        )}
      </Modal>
    </>
  );
}
function Blog({ path }: { path: string }) {
  const [topic, setTopic] = useState("All");
  const category = path.includes("for-dancers")
    ? "For dancers"
    : path.includes("for-anyone")
      ? "For anyone"
      : topic;
  const shown = articles.filter(
    (a) =>
      category === "All" || a.categories.includes(category as "For anyone"),
  );
  return (
    <>
      <PageHeading
        title={
          path.startsWith("author/")
            ? "Karls’s writing"
            : category === "All"
              ? "Stories from the dance floor."
              : category
        }
        intro="Six perspectives from the school’s 2020 editorial archive. Dates and attribution stay with every story."
      />
      <div className="gallery-filter">
        {["All", "For anyone", "For dancers"].map((t) => (
          <Button
            key={t}
            tone={category === t ? "primary" : "secondary"}
            onClick={() => setTopic(t)}
            asChild={path.startsWith("category/")}
          >
            {path.startsWith("category/") ? (
              <LocalLink
                to={
                  t === "All"
                    ? "dance-mania-blog"
                    : `category/${t === "For anyone" ? "for-anyone" : "for-dancers"}`
                }
              >
                {t}
              </LocalLink>
            ) : (
              t
            )}
          </Button>
        ))}
      </div>
      <div className="rhythm-journal">
        {shown.map((a, i) => (
          <article key={a.id}>
            {i === 0 && <DanceImage id="latin" />}
            <div>
              <span className="status-label">{dateLabel(a.date)}</span>
              <h2>
                <LocalLink to={a.id}>{a.title}</LocalLink>
              </h2>
              <p>{a.summary}</p>
              <LocalLink className="text-link" to={a.id}>
                Read the article
              </LocalLink>
            </div>
          </article>
        ))}
      </div>
      <LocalLink to="about-karls-aniscenko">
        About the historical author
      </LocalLink>
    </>
  );
}
export default function Interactive({ path }: { path: string }) {
  const p = programs.find((p) => path === `programs/${p.id}`);
  const person = people.find((p) => path === `instructors/${p.id}`);
  const article = articles.find((a) => a.id === path);
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className={path === "" ? "" : "inner-page"}>
        {path === "" ? (
          <Home />
        ) : path === "programs" ? (
          <Programs />
        ) : p ? (
          <>
            <PageHeading title={p.name} intro="Your program, in focus." />
            <div className="rhythm-detail">
              <DanceImage id={p.image} eager />
              <div>
                <ProgramFacts program={p} />
                <Action to="schedule">Find schedule documents</Action>
                <Action to="register" secondary>
                  Choose registration
                </Action>
              </div>
            </div>
            <NextSteps />
          </>
        ) : path === "schedule" ? (
          <Schedule />
        ) : path === "instructors" ? (
          <People />
        ) : person ? (
          <>
            <PageHeading
              title={person.name}
              intro={`${person.role} • Dance Mania School`}
            />
            <div className="rhythm-person-detail">
              <div className="initials">{person.initials}</div>
              <div>
                <PersonNote />
              </div>
            </div>
            <NextSteps />
          </>
        ) : path === "photos" ? (
          <>
            <PageHeading
              title="Movement, held in a frame."
              intro="Explore a licensed illustrative collection. The school’s original gallery remains available separately."
            />
            <Gallery layout="rhythmic" />
          </>
        ) : path.startsWith("videos-") &&
          ["videos-shows", "videos-competitions"].includes(path) ? (
          <>
            <PageHeading
              title={
                path === "videos-shows"
                  ? "The show goes on, in the archive."
                  : "Competition, in motion."
              }
              intro="Dated school references and a separate licensed playback demonstration."
            />
            <VideoArchive id={path} />
          </>
        ) : article ? (
          <>
            <PageHeading title={article.title} />
            <div className="rhythm-article">
              <ArticleMeta article={article} />
              <ArticleBody article={article} />
            </div>
          </>
        ) : path === "dance-mania-blog" ||
          (path.startsWith("category/") &&
            ["category/for-anyone", "category/for-dancers"].includes(path)) ||
          path === "author/dancemaniaschool_ru3lje" ? (
          <Blog path={path} />
        ) : [
            "registration-for-kids",
            "registration-for-adults",
            "contact-us",
          ].includes(path) ? (
          <>
            <PageHeading
              title={
                path === "contact-us"
                  ? "Let’s talk dance."
                  : path === "registration-for-kids"
                    ? "A first step, together."
                    : "Find your own rhythm."
              }
              intro={
                path === "contact-us"
                  ? inquiryIntro
                  : "Registration demonstration. Choose, review and try the local result."
              }
            />
            <div className="rhythm-form-layout">
              {path === "contact-us" ? (
                <ContactFacts />
              ) : (
                <aside>
                  <h2>
                    {path === "registration-for-kids"
                      ? "Under-16 guardian route"
                      : "Age 16+ route"}
                  </h2>
                  <p>
                    Before entering invented details, you can review program
                    descriptions and source schedule documents.
                  </p>
                  <Action to="schedule" secondary>
                    Schedules & fees
                  </Action>
                  <LocalLink className="text-link" to="register">
                    Change registration route
                  </LocalLink>
                </aside>
              )}
              <DemoForm
                kind={
                  path === "contact-us"
                    ? "inquiry"
                    : path === "registration-for-kids"
                      ? "kids"
                      : "adults"
                }
              />
            </div>
          </>
        ) : (
          <RhythmSupplement path={path} />
        )}
      </main>
      <Footer />
    </>
  );
}
