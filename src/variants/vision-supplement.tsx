import { useContext } from "react";
import { supplement } from "../domain/supplemental";
import {
  Action,
  ContactFacts,
  DanceImage,
  External,
  LocalLink,
  PageHeading,
  ResultContext,
} from "../shared/core";
export default function FrameSupplement({ path }: { path: string }) {
  const { completed } = useContext(ResultContext);
  const record = supplement(path);
  if (!record)
    return (
      <div className="frame-recovery">
        <PageHeading
          title={
            path === "thank-you"
              ? completed
                ? "Local demo result"
                : "No local demo result"
              : "Let’s find your place again."
          }
          intro={
            path === "thank-you"
              ? completed
                ? "Demo completed locally. No information was sent and no enrollment or inquiry was created."
                : "This page needs an in-memory demonstration result. Direct entry or refresh does not create a submission."
              : "404 — that local page or record could not be found."
          }
        />
        <aside
          {...(path === "thank-you" ? {} : { "data-testid": "not-found" })}
        >
          <h2>A clear way forward.</h2>
          <Action to="visit">Your first visit</Action>
          <Action to="register" secondary>
            Registration options
          </Action>
          <LocalLink className="text-link" to="/">
            School home
          </LocalLink>
        </aside>
      </div>
    );
  return (
    <>
      <PageHeading title={record.title} intro={record.intro} />
      <div className="frame-supplement-layout">
        <aside>
          <h2>{record.label}</h2>
          {record.evidence.time === "historical" && (
            <p className="status-label">Historical school archive</p>
          )}
          <p>
            {path === "visit"
              ? "A little preparation makes the first conversation easier."
              : path === "rent"
                ? "Discuss the details with the school before making plans."
                : "Keep the practical next step close to the story."}
          </p>
          <nav aria-label="Practical next steps">
            {record.actions.map((a, i) => (
              <Action key={a.to} to={a.to} secondary={i > 0}>
                {a.label}
              </Action>
            ))}
          </nav>
          {record.external?.map((e) => (
            <External key={e.url} href={e.url}>
              {e.title}
            </External>
          ))}
        </aside>
        <div>
          {record.image && <DanceImage id={record.image} />}
          {record.choices && (
            <div className="frame-registration-routes">
              <section>
                <h2>Under 16</h2>
                <p>A guardian explores the route using invented details.</p>
                <Action to="registration-for-kids">Under-16 local demo</Action>
              </section>
              <section>
                <h2>Age 16+</h2>
                <p>The source’s individual route, using invented details.</p>
                <Action to="registration-for-adults">16+ local demo</Action>
              </section>
            </div>
          )}
          {record.groups && (
            <div className="frame-fitting-index">
              {record.groups.map((g) => (
                <article key={g.title}>
                  <h2>{g.title}</h2>
                  <p>{g.description}</p>
                  <LocalLink to={g.to}>
                    {g.to === "contact-us"
                      ? "Discuss a fitting"
                      : "Explore this audience"}
                  </LocalLink>
                </article>
              ))}
            </div>
          )}
          {record.sections.map((s) => (
            <section className="frame-supplement-section" key={s.title}>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </section>
          ))}
          {record.contact && <ContactFacts />}
        </div>
      </div>
    </>
  );
}
