import { useState } from "react";
import {
  articles,
  documentNotes,
  dateLabel,
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
import { DemoForm } from "../shared/forms";
import { Gallery, VideoArchive } from "../shared/media";
import {
  ArticleBody,
  ArticleMeta,
  PersonNote,
  inquiryIntro,
} from "../shared/pages";
import FrameSupplement from "./vision-supplement";
import "./vision.css";
function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="frame-rail">
      <LocalLink to="/" className="wordmark">
        Dance
        <br />
        Mania<span>School</span>
      </LocalLink>
      <p className="rail-location">
        Ballroom & Latin
        <br />
        Richmond Hill
      </p>
      <button
        className="menu-button"
        aria-controls="frame-navigation"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "Close menu" : "Menu"}
      </button>
      <nav
        id="frame-navigation"
        className={open ? "open" : ""}
        aria-label="Main navigation"
      >
        {[
          ["programs", "Find your dance"],
          ["schedule", "Schedules & fees"],
          ["instructors", "Our people"],
          ["visit", "Your first visit"],
          ["photos", "In photographs"],
          ["dance-mania-blog", "The journal"],
          ["contact-us", "Talk to us"],
        ].map(([to, t]) => (
          <LocalLink key={to} to={to} onClick={() => setOpen(false)}>
            {t}
          </LocalLink>
        ))}
        <LocalLink className="rail-register" to="register">
          Registration
        </LocalLink>
      </nav>
      <LocalLink className="rail-gallery" to="/">
        Dance Mania School
      </LocalLink>
    </header>
  );
}
function Home() {
  return (
    <>
      <section className="frame-hero">
        <div className="frame-hero-copy">
          <p className="location-label">Dance Mania School</p>
          <h1>
            It begins
            <br />
            with a<br />
            connection.
          </h1>
          <p className="lead">
            To the music. To a partner.
            <br />
            To a way of moving that becomes your own.
          </p>
          <p>
            Ballroom and Latin American dance for children, adult social dancers
            and those drawn to competition.
          </p>
          <Action to="programs">Find your dance</Action>
        </div>
        <div className="frame-hero-images">
          <DanceImage id="tango" eager />
          <DanceImage id="latin" eager />
          <p>
            Balance. Rhythm. Partnership.
            <br />
            There is room to begin.
          </p>
        </div>
      </section>
      <section className="frame-audience">
        <h2>
          Come as you are.
          <br />
          Find a place to begin.
        </h2>
        <div>
          {[
            [
              "Children",
              "programs/children",
              "Explore a recreational introduction.",
            ],
            ["Adults", "programs/social", "Find the social side of dance."],
            [
              "Competitive dancers",
              "programs?goal=Competitive",
              "Explore Latin and Standard.",
            ],
          ].map(([t, to, d]) => (
            <LocalLink key={to} to={to}>
              <h3>{t}</h3>
              <p>{d}</p>
              <span>Explore your route</span>
            </LocalLink>
          ))}
        </div>
      </section>
      <section className="frame-partnership">
        <DanceImage id="waltz" />
        <div>
          <h2>
            The program.
            <br />
            The people.
            <br />
            The partnership.
          </h2>
          <p>
            Learning happens between people. Explore the dances that interest
            you, meet the school’s teachers and ask about a suitable class.
          </p>
          <Action to="instructors" secondary>
            Meet our people
          </Action>
          <p className="small">
            Group and private lessons, workshops, competitions and shows are
            part of the source offer. Current arrangements need confirmation.
          </p>
        </div>
      </section>
      <section className="frame-first-visit">
        <div>
          <p className="location-label">Your first visit</p>
          <h2>
            A little preparation.
            <br />A clearer first step.
          </h2>
          <p>
            Read the school’s original schedule and fee documents, then get in
            touch to arrange a visit.
          </p>
          <Action to="visit">Plan your visit</Action>
        </div>
        <div className="frame-visit-links">
          <LocalLink to="schedule">
            <h3>Read the documents</h3>
            <p>Current-period and archive labels in one place.</p>
          </LocalLink>
          <LocalLink to="register">
            <h3>Choose a registration route</h3>
            <p>Under 16 with a guardian, or age 16+.</p>
          </LocalLink>
          <LocalLink to="contact-us">
            <h3>Ask a question</h3>
            <p>Contact details and a safe local demonstration.</p>
          </LocalLink>
        </div>
      </section>
      <section className="frame-archive">
        <h2>What the floor remembers.</h2>
        <p>
          Historical performances and writing about rhythm, frame and
          partnership.
        </p>
        <div>
          <Action to="videos-competitions" secondary>
            Performance archive
          </Action>
          <Action to="dance-mania-blog" secondary>
            Explore the journal
          </Action>
        </div>
      </section>
      <ContactFacts />
    </>
  );
}
function Programs() {
  const state = useProgramFilters();
  const [selected, setSelected] = useState("latin");
  const active =
    state.results.find((p) => p.id === selected) || state.results[0];
  return (
    <>
      <PageHeading
        title="Find your dance."
        intro="Start with an interest. Explore the character of a program, then make the practical next step."
      />
      <ProgramFilters state={state} />
      {active ? (
        <div className="frame-program-master">
          <nav aria-label="Select a program">
            {state.results.map((p) => (
              <button
                key={p.id}
                aria-pressed={active.id === p.id}
                onClick={() => setSelected(p.id)}
              >
                <span>{p.goal}</span>
                <strong>{p.name}</strong>
                <span>
                  {p.audience === "Ask the school"
                    ? "Age eligibility: ask the school"
                    : p.audience}
                </span>
              </button>
            ))}
          </nav>
          <article>
            <DanceImage id={active.image} />
            <h2>{active.name}</h2>
            <ProgramFacts program={active} />
            <div className="actions">
              <Action to={`programs/${active.id}`}>Program in detail</Action>
              <Action to="contact-us" secondary>
                Ask the school
              </Action>
            </div>
            <aside className="program-people-note">
              <h3>Connect the program to the people</h3>
              <p>
                The source does not assign individual teachers to these
                programs.
              </p>
              <LocalLink to="instructors">
                Meet the school’s teachers and instructors
              </LocalLink>
            </aside>
          </article>
        </div>
      ) : (
        <Empty reset={state.reset}>
          There is no matching program. Clear filters to return to all four
          families.
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
        title="Make a place for dance."
        intro="Choose a source document. Keep its period and audience in view."
      />
      <div className="frame-schedule">
        <section>
          <DocumentFilters state={state} />
          {state.results.map((d) => (
            <article className="frame-document" key={d.id}>
              <span className="status-label">
                {d.archive
                  ? "Archive"
                  : d.period === "Undated"
                    ? "Date unknown"
                    : "Current period"}{" "}
                • {d.period}
              </span>
              <h2>{d.title}</h2>
              <p>
                {d.audience} / {d.type}
              </p>
              <External href={d.url}>Open original document</External>
              <details>
                <summary>Document access & context</summary>
                <p>
                  {documentNotes[d.id]} This is an external Google Drive
                  document; current operation and places need confirmation.
                </p>
              </details>
            </article>
          ))}
          {!state.results.length && (
            <Empty reset={state.reset}>
              Try another period, audience or type.
            </Empty>
          )}
        </section>
        <aside>
          <h2>What to do next</h2>
          <p>
            Read the relevant schedule and fees, then ask the school about the
            right class and a visit.
          </p>
          <p>
            Documents reviewed November 16, 2026. The catalogue summarizes
            readable source pages; no live timetable is claimed. Age 25 appears
            in both source audience labels.
          </p>
          <Action to="visit">Plan your first visit</Action>
          <Action to="register" secondary>
            Registration options
          </Action>
        </aside>
      </div>
    </>
  );
}
function People() {
  return (
    <>
      <PageHeading
        title="A school is its people."
        intro="Meet the names listed by Dance Mania, with the space to ask the questions that matter to you."
      />
      {["Teacher", "Instructor"].map((role) => (
        <section className="frame-people-group" key={role}>
          <header>
            <h2>{role === "Teacher" ? "Teachers" : "Instructors"}</h2>
            <p>
              {role === "Teacher"
                ? "Six names in the source teaching group."
                : "Four names in the source instructor group."}
            </p>
          </header>
          <div>
            {people
              .filter((p) => p.role === role)
              .map((p) => (
                <article key={p.id}>
                  <div className="initials">{p.initials}</div>
                  <div>
                    <p className="small">{p.role}</p>
                    <h3>{p.name}</h3>
                    <LocalLink to={`instructors/${p.id}`}>
                      Meet {p.name.split(" ")[0]}
                    </LocalLink>
                  </div>
                </article>
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
          : null,
    selected = fixed || topic;
  return (
    <>
      <PageHeading
        title={
          path.startsWith("author/")
            ? "The author’s archive."
            : fixed || "Notes from the floor."
        }
        intro="Writing about movement, practice and partnership. The school’s six-entry 2020 archive."
      />
      <div className="frame-journal">
        <aside>
          <h2>Explore by interest</h2>
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
          <LocalLink to="about-karls-aniscenko">
            About Karls Aniscenko
          </LocalLink>
        </aside>
        <div>
          {articles
            .filter(
              (a) =>
                selected === "All" ||
                a.categories.includes(selected as "For anyone"),
            )
            .map((a) => (
              <article key={a.id}>
                <time dateTime={a.date}>{dateLabel(a.date)}</time>
                <h2>
                  <LocalLink to={a.id}>{a.title}</LocalLink>
                </h2>
                <p>{a.summary}</p>
                <LocalLink to={a.id}>Read this perspective</LocalLink>
              </article>
            ))}
        </div>
      </div>
    </>
  );
}
export default function Vision({ path }: { path: string }) {
  const p = programs.find((p) => path === `programs/${p.id}`),
    person = people.find((p) => path === `instructors/${p.id}`),
    article = articles.find((a) => a.id === path);
  return (
    <>
      <Header />
      <div className="frame-canvas">
        <main id="main" tabIndex={-1} className={path ? "inner-page" : ""}>
          {path === "" ? (
            <Home />
          ) : path === "programs" ? (
            <Programs />
          ) : p ? (
            <>
              <PageHeading title={p.name} />
              <div className="frame-program-detail">
                <section>
                  <DanceImage id={p.image} />
                  <h2>The dances in this family</h2>
                  <ProgramFacts program={p} />
                </section>
                <aside>
                  <h2>
                    From interest
                    <br />
                    to first visit.
                  </h2>
                  <p>
                    Choose a document, meet the people and confirm a suitable
                    place to begin.
                  </p>
                  <Action to="schedule">Schedule documents</Action>
                  <Action to="register" secondary>
                    Registration options
                  </Action>
                  <LocalLink className="text-link" to="instructors">
                    Explore the people
                  </LocalLink>
                </aside>
              </div>
            </>
          ) : path === "schedule" ? (
            <Schedule />
          ) : path === "instructors" ? (
            <People />
          ) : person ? (
            <>
              <div className="frame-person-profile">
                <div className="initials">{person.initials}</div>
                <section>
                  <PageHeading
                    title={person.name}
                    intro={`${person.role} at Dance Mania School`}
                  />
                  <h2>A name to begin a conversation.</h2>
                  <PersonNote />
                </section>
              </div>
              <NextSteps />
            </>
          ) : path === "photos" ? (
            <>
              <PageHeading
                title="The space between the steps."
                intro="An illustrative photo essay in partnership, posture and rhythm, with a complete browsable collection."
              />
              <Gallery layout="essay" />
            </>
          ) : ["videos-competitions", "videos-shows"].includes(path) ? (
            <>
              <PageHeading
                title={
                  path === "videos-shows"
                    ? "A performance, remembered."
                    : "The competition floor, remembered."
                }
                intro="School recordings from 2019. A separate licensed clip demonstrates local playback."
              />
              <div className="frame-media">
                <VideoArchive id={path} />
              </div>
            </>
          ) : article ? (
            <>
              <div className="frame-article-title">
                <p className="location-label">From the 2020 journal</p>
                <h1>{article.title}</h1>
              </div>
              <div className="frame-article-reading">
                <ArticleBody article={article} />
                <ArticleMeta article={article} />
              </div>
            </>
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
                    ? "Begin a conversation."
                    : path === "registration-for-kids"
                      ? "A beginning, together."
                      : "Your next step."
                }
                intro={
                  path === "contact-us"
                    ? inquiryIntro
                    : "A safe local demonstration of the registration journey."
                }
              />
              <div className="frame-form-pair">
                <aside>
                  {path === "contact-us" ? (
                    <ContactFacts />
                  ) : (
                    <>
                      <h2>
                        {path === "registration-for-kids"
                          ? "For a dancer under 16"
                          : "For a dancer aged 16+"}
                      </h2>
                      <p>
                        {path === "registration-for-kids"
                          ? "A guardian explores the route using invented details."
                          : "Explore the source’s age 16+ route using invented details."}{" "}
                        This laboratory cannot enroll anyone.
                      </p>
                      <LocalLink to="register">
                        Change registration route
                      </LocalLink>
                      <h3>Before the first lesson</h3>
                      <p>
                        Ask about suitable classes, current fees, visit
                        arrangements and what to bring.
                      </p>
                      <Action to="visit" secondary>
                        First-visit guide
                      </Action>
                    </>
                  )}
                </aside>
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
            <FrameSupplement path={path} />
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
