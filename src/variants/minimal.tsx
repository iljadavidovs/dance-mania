import { useState } from "react";
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
  PageHeading,
  ProgramFacts,
  ProgramFilters,
  useDocumentFilters,
  useProgramFilters,
} from "../shared/core";
import { Button } from "../shared/ui/button";
import { DemoForm } from "../shared/forms";
import { Gallery, VideoArchive } from "../shared/media";
import {
  ArticleBody,
  ArticleMeta,
  PersonNote,
  inquiryIntro,
} from "../shared/pages";
import QuietSupplement from "./minimal-supplement";
import "./minimal.css";
function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="quiet-header">
      <LocalLink className="wordmark" to="/">
        Dance Mania<span>School</span>
      </LocalLink>
      <button
        className="menu-button"
        aria-expanded={open}
        aria-controls="quiet-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close menu" : "Menu"}
      </button>
      <nav
        className={open ? "open" : ""}
        id="quiet-navigation"
        aria-label="Main navigation"
      >
        {[
          ["programs", "Programs"],
          ["schedule", "Schedules & fees"],
          ["instructors", "People"],
          ["photos", "Gallery"],
          ["contact-us", "Contact"],
          ["register", "Registration"],
        ].map(([to, t]) => (
          <LocalLink key={to} to={to} onClick={() => setOpen(false)}>
            {t}
          </LocalLink>
        ))}
      </nav>
    </header>
  );
}
function Home() {
  return (
    <>
      <section className="quiet-hero">
        <div>
          <p className="location-label">
            Ballroom & Latin American dance in Richmond Hill
          </p>
          <h1>
            A place
            <br />
            to learn
            <br />
            to dance.
          </h1>
          <p className="lead">
            For children, adults and competitive dancers. Explore the school,
            find a program and make your next step clear.
          </p>
          <Action to="programs">Find a program</Action>
        </div>
        <DanceImage id="tango" eager />
      </section>
      <section className="quiet-home-index">
        <h2>Our programs</h2>
        <div>
          {programs.map((p) => (
            <LocalLink key={p.id} to={`programs/${p.id}`}>
              <h3>{p.name}</h3>
              <p>
                {p.dances.slice(0, 3).join(" / ") ||
                  "Explore recreational classes for children"}
              </p>
              <span>View program</span>
            </LocalLink>
          ))}
        </div>
      </section>
      <section className="quiet-doc-home">
        <div>
          <h2>Schedules & fees</h2>
          <p>
            Original school documents.
            <br />
            Clear periods. Honest context.
          </p>
          <LocalLink to="schedule">View all five documents</LocalLink>
        </div>
        <div>
          {documents.slice(0, 3).map((d) => (
            <article key={d.id}>
              <p className="small">
                {d.audience} / {d.period}
              </p>
              <h3>{d.title}</h3>
              <External href={d.url}>Open original</External>
            </article>
          ))}
        </div>
      </section>
      <section className="quiet-home-people">
        <h2>Meet the school</h2>
        <p>Teachers and instructors, listed with care.</p>
        <div>
          {people.slice(0, 6).map((p) => (
            <LocalLink key={p.id} to={`instructors/${p.id}`}>
              {p.name}
              <span>{p.role}</span>
            </LocalLink>
          ))}
        </div>
        <LocalLink className="text-link" to="instructors">
          All ten people
        </LocalLink>
      </section>
      <section className="quiet-home-visit">
        <ContactFacts />
        <div>
          <h2>Before your first visit</h2>
          <p>
            Group and private lessons, workshops, competitions and shows form
            part of the school’s offer. Ask the school about current
            arrangements.
          </p>
          <Action to="visit">Plan a visit</Action>
          <LocalLink className="text-link" to="register">
            Explore registration
          </LocalLink>
        </div>
      </section>
      <section className="quiet-archive-home">
        <h2>From the archive</h2>
        <p>
          Six articles, historical performances and a collection of dance
          photographs.
        </p>
        <LocalLink to="dance-mania-blog">Read the journal</LocalLink>
        <LocalLink to="photos">Browse photographs</LocalLink>
        <LocalLink to="videos-shows">Watch the archive</LocalLink>
      </section>
    </>
  );
}
function Programs() {
  const state = useProgramFilters();
  return (
    <>
      <PageHeading
        title="Programs"
        intro="Four program families. Choose a purpose, then explore the dances."
      />
      <ProgramFilters state={state} />
      <div className="quiet-program-list">
        {state.results.map((p) => (
          <article key={p.id}>
            <div>
              <span className="small">{p.goal}</span>
              <h2>
                <LocalLink to={`programs/${p.id}`}>{p.name}</LocalLink>
              </h2>
              <p>{p.summary}</p>
            </div>
            <div>
              <details>
                <summary>See dances & program facts</summary>
                <ProgramFacts program={p} />
              </details>
              <Action to={`programs/${p.id}`} secondary>
                Program details
              </Action>
            </div>
          </article>
        ))}
      </div>
      {!state.results.length && (
        <Empty reset={state.reset}>
          No program matches these filters. Clear them to browse all programs.
        </Empty>
      )}
    </>
  );
}
function Schedule() {
  const state = useDocumentFilters();
  return (
    <>
      <PageHeading
        title="Schedules & fees"
        intro="Read the source documents. Confirm current times, fees and places directly with the school."
      />
      <p className="source-note">
        Documents reviewed November 16, 2026. Readable source pages are
        summarized below. This is a document catalogue, not a live timetable.
        The age-25 overlap in the source labels is preserved.
      </p>
      <DocumentFilters state={state} />
      <div className="quiet-documents">
        <div className="quiet-table-heading" aria-hidden="true">
          <span>Document</span>
          <span>Audience / context</span>
          <span>Source</span>
        </div>
        {state.results.map((d) => (
          <article key={d.id}>
            <div>
              <h2>{d.title}</h2>
              <p className="small">
                {d.type} / {d.period}
              </p>
            </div>
            <div>
              <p>{d.audience}</p>
              <span className="status-label">
                {d.archive
                  ? "Archive"
                  : d.period === "Undated"
                    ? "Date unknown"
                    : "Current period"}
              </span>
              <details>
                <summary>Read availability note</summary>
                <p>{documentNotes[d.id]}</p>
              </details>
            </div>
            <External href={d.url}>Open document</External>
          </article>
        ))}
      </div>
      {!state.results.length && (
        <Empty reset={state.reset}>
          No matching documents. Choose another period or type.
        </Empty>
      )}
      <div className="quiet-end">
        <h2>Ready to ask a question?</h2>
        <Action to="contact-us" secondary>
          Contact demonstration
        </Action>
        <LocalLink to="register">Registration options</LocalLink>
      </div>
    </>
  );
}
function People() {
  return (
    <>
      <PageHeading
        title="People"
        intro="The school’s source listing, grouped into teachers and instructors."
      />
      {["Teacher", "Instructor"].map((role) => (
        <section className="quiet-people-index" key={role}>
          <h2>{role === "Teacher" ? "Teachers" : "Instructors"}</h2>
          <div>
            {people
              .filter((p) => p.role === role)
              .map((p) => (
                <LocalLink key={p.id} to={`instructors/${p.id}`}>
                  <span className="initials">{p.initials}</span>
                  <h3>{p.name}</h3>
                  <span>View listing</span>
                </LocalLink>
              ))}
          </div>
        </section>
      ))}
    </>
  );
}
function Blog({ path }: { path: string }) {
  const [topic, setTopic] = useState("All");
  const fixed =
    path === "category/for-anyone"
      ? "For anyone"
      : path === "category/for-dancers"
        ? "For dancers"
        : null;
  const selected = fixed || topic;
  return (
    <>
      <PageHeading
        title={
          path.startsWith("author/")
            ? "Karls Aniscenko — author archive"
            : fixed || "The journal"
        }
        intro="Six historical posts from 2020. Original summaries, with dates and attribution."
      />
      <div className="quiet-topic-index">
        {["All", "For anyone", "For dancers"].map((t) =>
          fixed ? (
            <LocalLink
              key={t}
              to={
                t === "All"
                  ? "dance-mania-blog"
                  : `category/${t === "For anyone" ? "for-anyone" : "for-dancers"}`
              }
            >
              {t}
            </LocalLink>
          ) : (
            <Button
              key={t}
              tone={selected === t ? "primary" : "plain"}
              onClick={() => setTopic(t)}
            >
              {t}
            </Button>
          ),
        )}
      </div>
      <div className="quiet-journal-list">
        {articles
          .filter(
            (a) =>
              selected === "All" ||
              a.categories.includes(selected as "For anyone"),
          )
          .map((a) => (
            <article key={a.id}>
              <time dateTime={a.date}>{dateLabel(a.date)}</time>
              <div>
                <h2>
                  <LocalLink to={a.id}>{a.title}</LocalLink>
                </h2>
                <p>{a.summary}</p>
                <p className="small">{a.categories.join(" / ")}</p>
              </div>
              <LocalLink to={a.id}>Read article</LocalLink>
            </article>
          ))}
      </div>
      <LocalLink to="about-karls-aniscenko">
        Read the historical author biography
      </LocalLink>
    </>
  );
}
export default function Minimal({ path }: { path: string }) {
  const program = programs.find((p) => path === `programs/${p.id}`),
    person = people.find((p) => path === `instructors/${p.id}`),
    article = articles.find((a) => a.id === path);
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className={path ? "inner-page" : ""}>
        {path === "" ? (
          <Home />
        ) : path === "programs" ? (
          <Programs />
        ) : program ? (
          <>
            <PageHeading title={program.name} />
            <div className="quiet-program-detail">
              <div>
                <ProgramFacts program={program} />
                <div className="actions">
                  <Action to="schedule">Schedule documents</Action>
                  <Action to="register" secondary>
                    Registration options
                  </Action>
                </div>
              </div>
              <DanceImage id={program.image} />
            </div>
            <LocalLink className="text-link" to="programs">
              All programs
            </LocalLink>
          </>
        ) : path === "schedule" ? (
          <Schedule />
        ) : path === "instructors" ? (
          <People />
        ) : person ? (
          <>
            <PageHeading title={person.name} intro={person.role} />
            <div className="quiet-person">
              <div className="initials">{person.initials}</div>
              <section>
                <h2>A source-backed introduction</h2>
                <PersonNote />
              </section>
            </div>
          </>
        ) : path === "photos" ? (
          <>
            <PageHeading
              title="Photographs"
              intro="A disciplined collection of licensed illustrative dance images."
            />
            <Gallery layout="sheet" />
          </>
        ) : ["videos-competitions", "videos-shows"].includes(path) ? (
          <>
            <PageHeading
              title={
                path === "videos-shows"
                  ? "Show recordings"
                  : "Competition recordings"
              }
              intro="The school’s historical references, with a separate licensed playback demonstration."
            />
            <VideoArchive id={path} />
          </>
        ) : article ? (
          <article className="quiet-reading">
            <PageHeading title={article.title} />
            <ArticleMeta article={article} />
            <ArticleBody article={article} />
          </article>
        ) : [
            "dance-mania-blog",
            "category/for-anyone",
            "category/for-dancers",
            "author/dancemaniaschool_ru3lje",
          ].includes(path) ? (
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
                  ? "Contact"
                  : path === "registration-for-kids"
                    ? "Registration — under 16"
                    : "Registration — age 16+"
              }
              intro={
                path === "contact-us"
                  ? inquiryIntro
                  : "A single, clear local demonstration form. No enrollment is created."
              }
            />
            {path === "contact-us" && <ContactFacts />}
            <div className="quiet-form-wrap">
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
          <QuietSupplement path={path} />
        )}
      </main>
      <Footer />
    </>
  );
}
