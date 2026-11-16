import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { variants } from "../domain/data";
import "./viewer.css";
export default function Viewer({ path }: { path: string }) {
  return (
    <div className="viewer">
      <header className="viewer-header">
        <Link to="/">
          Dance Mania <span>Design laboratory</span>
        </Link>
        <Link to="/provenance">Sources & evidence</Link>
      </header>
      <main>
        {path === "/" ? (
          <>
            <div className="viewer-intro">
              <p>One school. Three independent directions.</p>
              <h1>
                Different ways
                <br />
                to find the floor.
              </h1>
              <p>
                A local redesign study for Dance Mania School in Richmond Hill.
                Explore complete websites built around the same source-backed
                content, then compare the experience.
              </p>
            </div>
            <div className="viewer-directions">
              {variants.map((v, i) => (
                <article key={v.id}>
                  <div className="preview-pair">
                    <Link
                      to={`/${v.id}`}
                      className="desktop-preview"
                      aria-label={`Open ${v.name} full website`}
                    >
                      <img
                        src={`/previews/${v.id}-desktop.jpg`}
                        alt={`${v.name}: actual 1440-pixel desktop screenshot`}
                        width="1440"
                        height="1000"
                        loading={i ? "lazy" : "eager"}
                      />
                    </Link>
                    <Link
                      to={`/${v.id}`}
                      className="mobile-preview"
                      aria-label={`Open ${v.name} mobile-responsive website`}
                    >
                      <img
                        src={`/previews/${v.id}-mobile.jpg`}
                        alt={`${v.name}: actual 390-pixel mobile screenshot`}
                        width="390"
                        height="844"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                  <div className="direction-description">
                    <div>
                      <p>
                        {i === 0
                          ? "Expressive discovery"
                          : i === 1
                            ? "Instantaneous clarity"
                            : "Partnership & first visits"}
                      </p>
                      <h2>{v.name}</h2>
                    </div>
                    <p>{v.description}</p>
                    <Link className="viewer-open" to={`/${v.id}`}>
                      Explore full website{" "}
                      <ArrowUpRight size={20} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="viewer-note">
              <h2>Compare the experience, not just the cover.</h2>
              <p>
                Each direction includes programs, documents, people, media,
                journal, dancewear and local form simulations. The static
                switcher preserves the page and compatible filters. Quiet Form
                has zero authored UI motion.
              </p>
              <p>
                Preview images are actual desktop and mobile captures from the
                running application. Forms send nothing. Illustrative
                photography is not school documentation.
              </p>
              <Link to="/provenance">
                Inspect content, rights & verification
              </Link>
            </div>
          </>
        ) : path === "/provenance" ? (
          <div className="provenance-page">
            <h1>
              Sources, rights
              <br />& local evidence.
            </h1>
            <p className="lead">
              A truthful local laboratory, checked against the school’s public
              website on November 16, 2026.
            </p>
            <section>
              <h2>Content status</h2>
              <p>
                School contact information, four program families, ten people
                and five document labels were rechecked. Readable schedule and
                fee documents are summarized; current operation, open places,
                opening hours and access arrangements need confirmation. Summer
                2026 and the six 2020 articles are historical. The Toronto Grand
                Cup poster advertises May 9–10, 2020; no future event is
                verified.
              </p>
              <p>
                The five Google Drive documents retain exact source
                destinations. Fresh browser access recovered readable schedules,
                the two-page Fall–Winter fee document and the historical summer
                camp document. The catalogue summarizes that evidence and links
                to the originals; it does not claim live class operation or
                places.
              </p>
            </section>
            <section>
              <h2>Photography & media</h2>
              <p>
                School photographs, logo and recordings were not copied into
                these prototypes. All displayed dance images are licensed
                illustrations, with local assets and attribution.
              </p>
              <ul>
                <li>
                  “Hold me close”, Berlin 2016 — Thomas Quine, CC BY 2.0.
                  Resized, compressed and cropped in layouts.
                </li>
                <li>
                  “Ballroom dance exhibition”, Prague — che, CC BY-SA 2.5.
                  Resized, cropped and shown in grayscale in Quiet Form;
                  adaptations retain CC BY-SA 2.5.
                </li>
                <li>“Waltz UMass Amherst” — Gabeodess, public domain.</li>
                <li>
                  Jive steps at a British dance hall, 1945 — Ministry of
                  Information, public domain.
                </li>
                <li>
                  Charleston dance — ARTSEDGE / The Kennedy Center, CC BY 3.0,
                  2012. Silent 18-second resized excerpt; unrelated to the
                  school. Original:{" "}
                  <a
                    href="https://commons.wikimedia.org/wiki/File:Charleston-dance.webm"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Commons source & attribution
                  </a>
                  .
                </li>
              </ul>
              <p>
                Barlow Condensed, DM Sans, Manrope, Fraunces and Public Sans are
                locally hosted Google Fonts with retained SIL OFL 1.1 notices.
                Only active families load. People use initials, never substitute
                portraits.
              </p>
            </section>
            <section>
              <h2>Demonstration forms</h2>
              <p>
                Use invented details only. Input stays in disposable component
                memory. No backend, submission endpoint, analytics, storage or
                enrollment exists. A local success is explicitly a simulation.
                Reset, navigation, variant change and reload discard input.
              </p>
            </section>
            <section>
              <h2>Inspect the evidence</h2>
              <div className="evidence-links">
                {[
                  ["index.html", "Browse actual verification screenshots"],
                  ["site-inventory.md", "Source inventory"],
                  ["visual-audit.md", "Source visual audit"],
                  ["skills.md", "Pinned design references"],
                  ["directions.md", "Design commitments"],
                  ["provenance.md", "Content provenance"],
                  ["asset-manifest.json", "Asset rights manifest"],
                  ["route-matrix.md", "Route verification matrix"],
                  ["test-results.md", "Executed test results"],
                  ["visual-review.md", "Visual critique & comparison"],
                  ["screenshot-manifest.json", "Screenshot capture metadata"],
                  ["acceptance.md", "Acceptance checklist"],
                ].map(([file, t]) => (
                  <a
                    key={file}
                    href={`/evidence/${file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t}
                  </a>
                ))}
              </div>
            </section>
            <Link to="/">Return to all three directions</Link>
          </div>
        ) : (
          <div className="viewer-intro">
            <h1>Page not found.</h1>
            <p data-testid="not-found">
              404 — choose one of the three complete local experiences.
            </p>
            <Link to="/">Return to the design gallery</Link>
          </div>
        )}
      </main>
      <footer className="viewer-footer">
        Dance Mania School redesign laboratory • Local only • No deployment
      </footer>
    </div>
  );
}
