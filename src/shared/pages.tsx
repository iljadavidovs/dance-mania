import { articles, contact, dateLabel } from "../domain/data";
import type { Article } from "../domain/data";
import { Action, External, LocalLink } from "./core";
export function ArticleBody({ article }: { article: Article }) {
  return (
    <div className="article-body">
      <p className="lead">{article.summary}</p>
      {article.sections.map((s) => (
        <section key={s.title}>
          <h2>{s.title}</h2>
          <p>{s.body}</p>
        </section>
      ))}
      {article.media.length > 0 && (
        <section>
          <h2>Original media references</h2>
          <p>
            External providers may restrict access. Captions, current
            availability and reproduction rights have not been verified.
          </p>
          <ul className="media-links">
            {article.media.map((m) => (
              <li key={m.url}>
                <External href={m.url}>{m.title}</External>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="source-note">
        Original summary of the school’s {dateLabel(article.date)} post.{" "}
        <External href={article.evidence.source}>
          Read the original article
        </External>
      </p>
      <nav className="related" aria-label="Related reading">
        <h2>Continue reading</h2>
        {articles
          .filter((a) => a.id !== article.id)
          .slice(0, 3)
          .map((a) => (
            <LocalLink key={a.id} to={a.id}>
              {a.title}
            </LocalLink>
          ))}
        <LocalLink to="dance-mania-blog">All six journal entries</LocalLink>
      </nav>
    </div>
  );
}
export function ArticleMeta({ article }: { article: Article }) {
  return (
    <aside className="article-meta">
      <time dateTime={article.date}>{dateLabel(article.date)}</time>
      <span className="status-label">Historical archive</span>
      <p>{article.credit}</p>
      <LocalLink to="author/dancemaniaschool_ru3lje">
        Karls’s author archive
      </LocalLink>
      <LocalLink to="about-karls-aniscenko">
        Historical author biography
      </LocalLink>
      <div>
        {article.categories.map((c) => (
          <LocalLink
            key={c}
            to={`category/${c === "For anyone" ? "for-anyone" : "for-dancers"}`}
          >
            {c}
          </LocalLink>
        ))}
      </div>
    </aside>
  );
}
export function RegisterChoices() {
  return (
    <div className="registration-choices">
      <section>
        <span className="status-label">Guardian route</span>
        <h2>Under 16</h2>
        <p>
          Explore a child’s registration with a guardian’s invented contact
          details.
        </p>
        <Action to="registration-for-kids">Under-16 demo</Action>
      </section>
      <section>
        <span className="status-label">Individual route</span>
        <h2>Age 16+</h2>
        <p>
          The source’s separate registration route for dancers aged 16 and over.
        </p>
        <Action to="registration-for-adults">16+ demo</Action>
      </section>
      <p className="small">
        Schedule documents use ages 4–25 and 25+. Their overlap at age 25 is
        preserved. These are separate from the registration division.
      </p>
    </div>
  );
}
export function PersonNote() {
  return (
    <>
      <p>
        The source confirms this person’s name and group. A detailed biography,
        qualifications, teaching specialisms and current availability are not
        published in the inspected listing.
      </p>
      <p>
        Ask the school about who may be teaching the program you are
        considering.
      </p>
      <Action to="contact-us">Ask about teaching</Action>
      <LocalLink className="text-link" to="instructors">
        Meet all ten people
      </LocalLink>
    </>
  );
}
export const inquiryIntro = `Talk with ${contact.owners.join(" and ")} about a class, a visit, a shoe fitting or studio hire.`;
