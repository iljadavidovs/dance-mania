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
export default function QuietSupplement({ path }: { path: string }) {
  const { completed } = useContext(ResultContext);
  const record = supplement(path);
  if (!record)
    return (
      <div className="quiet-supplement">
        <PageHeading
          title={
            path === "thank-you"
              ? completed
                ? "Local demo result"
                : "No local demo result"
              : "Page not found"
          }
          intro={
            path === "thank-you"
              ? completed
                ? "Demo completed locally. No information was sent and no enrollment or inquiry was created."
                : "This page needs an in-memory demonstration result. Direct entry or refresh does not create a submission."
              : "404 — the page or record does not exist in this local catalogue."
          }
        />
        <nav
          aria-label="Continue exploring"
          {...(path === "thank-you" ? {} : { "data-testid": "not-found" })}
        >
          <LocalLink to="/">School home</LocalLink>
          <LocalLink to="programs">Programs</LocalLink>
          <LocalLink to="register">Registration options</LocalLink>
        </nav>
      </div>
    );
  return (
    <div className="quiet-supplement">
      <PageHeading title={record.label} intro={record.intro} />
      {record.choices && (
        <div className="quiet-registration-index">
          {[
            [
              "Under 16",
              "A guardian’s invented contact details.",
              "registration-for-kids",
            ],
            [
              "Age 16+",
              "The source’s individual registration route.",
              "registration-for-adults",
            ],
          ].map(([title, text, to]) => (
            <section key={to}>
              <h2>{title}</h2>
              <p>{text}</p>
              <Action to={to} secondary>
                Open local demonstration
              </Action>
            </section>
          ))}
        </div>
      )}
      {record.groups && (
        <div className="quiet-supplement-list">
          {record.groups.map((g) => (
            <article key={g.title}>
              <h2>{g.title}</h2>
              <p>{g.description}</p>
              <LocalLink to={g.to}>
                {g.to === "contact-us" ? "Fitting inquiry" : "View categories"}
              </LocalLink>
            </article>
          ))}
        </div>
      )}
      <div className="quiet-supplement-reading">
        {record.sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </section>
        ))}
      </div>
      {record.contact && <ContactFacts />}
      {record.image && (
        <DanceImage id={record.image} className="quiet-supplement-image" />
      )}
      <nav className="quiet-supplement-next" aria-label="Next steps">
        {record.actions.map((a) => (
          <LocalLink key={a.to} to={a.to}>
            {a.label}
          </LocalLink>
        ))}
        {record.external?.map((e) => (
          <External key={e.url} href={e.url}>
            {e.title}
          </External>
        ))}
      </nav>
    </div>
  );
}
