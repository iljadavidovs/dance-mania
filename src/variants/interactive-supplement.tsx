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
import { RegisterChoices } from "../shared/pages";
export default function RhythmSupplement({ path }: { path: string }) {
  const { completed } = useContext(ResultContext);
  const record = supplement(path);
  if (!record)
    return (
      <>
        <PageHeading
          title={
            path === "thank-you"
              ? completed
                ? "Local demo result"
                : "No local demo result"
              : "This page is off the floor."
          }
          intro={
            path === "thank-you"
              ? completed
                ? "Demo completed locally. No information was sent and no enrollment or inquiry was created."
                : "This page needs an in-memory demonstration result. Direct entry or refresh does not create a submission."
              : "We couldn’t find that local page or record. Choose a known route to continue."
          }
        />
        <div
          className="rhythm-recovery"
          {...(path === "thank-you" ? {} : { "data-testid": "not-found" })}
        >
          {path !== "thank-you" && <h2>404 — page not found</h2>}
          <div className="actions">
            <Action to="programs">Browse programs</Action>
            <Action to="register" secondary>
              Registration options
            </Action>
            <LocalLink to="/">School home</LocalLink>
          </div>
        </div>
      </>
    );
  return (
    <>
      <PageHeading title={record.title} intro={record.intro} />
      {record.choices && <RegisterChoices />}
      {record.image ? (
        <section className="rhythm-supplement-feature">
          <DanceImage id={record.image} />
          <div>
            {record.sections.map((s) => (
              <section key={s.title}>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </section>
            ))}
          </div>
        </section>
      ) : (
        <div className="rhythm-supplement-sections">
          {record.sections.map((s) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </section>
          ))}
        </div>
      )}
      {record.groups && (
        <div className="rhythm-supplement-groups">
          {record.groups.map((g) => (
            <article key={g.title}>
              <h2>{g.title}</h2>
              <p>{g.description}</p>
              <Action to={g.to}>
                {g.to === "contact-us"
                  ? "Ask about a fitting"
                  : `Explore ${g.title.toLowerCase()}’s shoes`}
              </Action>
            </article>
          ))}
        </div>
      )}
      <div className="rhythm-supplement-actions">
        {record.actions.map((a, i) => (
          <Action key={a.to} to={a.to} secondary={i > 0}>
            {a.label}
          </Action>
        ))}
      </div>
      {record.external && (
        <div className="rhythm-source-links">
          {record.external.map((e) => (
            <External key={e.url} href={e.url}>
              {e.title}
            </External>
          ))}
        </div>
      )}
      {record.contact && (
        <section className="rhythm-supplement-contact">
          <ContactFacts />
        </section>
      )}
    </>
  );
}
