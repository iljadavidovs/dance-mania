import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { images, historicalVideos } from "../domain/data";
import { DanceImage, Empty, External, useVariant } from "./core";
import { Button } from "./ui/button";
import { Modal } from "./ui/dialog";
export function Gallery({
  layout,
}: {
  layout: "rhythmic" | "sheet" | "essay";
}) {
  const variant = useVariant();
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<number | null>(null);
  const shown = images.filter(
    (i) => category === "All" || i.category === category,
  );
  const item = shown[active || 0];
  const change = (delta: number) =>
    setActive((i) => ((i || 0) + delta + shown.length) % shown.length);
  return (
    <>
      <div className="gallery-filter" aria-label="Photo categories">
        {["All", "Latin", "Standard", "Archive", "School photos"].map((c) => (
          <Button
            key={c}
            tone={category === c ? "primary" : "secondary"}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </Button>
        ))}
      </div>
      <p className="small" role="status">
        {shown.length} illustrative photographs. School photo reuse rights have
        not been established;{" "}
        <External href="https://dancemaniaschool.com/photos/">
          view the school’s original gallery
        </External>
        .
      </p>
      {shown.length ? (
        <div className={`photo-gallery ${layout}`}>
          {shown.map((i, index) => (
            <button
              className="photo-trigger"
              key={i.id}
              onClick={() => setActive(index)}
              aria-label={`Open photo: ${i.title}`}
            >
              <DanceImage id={i.id} />
              <span>View photograph</span>
            </button>
          ))}
        </div>
      ) : (
        <Empty>
          No school photographs are reproduced. Choose a licensed illustrative
          collection above, or visit the source gallery.
        </Empty>
      )}
      <Modal
        variant={variant}
        open={active !== null}
        onOpenChange={(v) => !v && setActive(null)}
        title={item?.title || "Photograph"}
        description="Licensed illustrative photography, not Dance Mania School documentation."
      >
        {item && (
          <>
            <DanceImage id={item.id} eager caption={false} />
            <p>{item.alt}</p>
            <p className="small">
              {item.credit}.{" "}
              <External href={item.source}>License & original</External>
            </p>
            <div className="lightbox-controls">
              <Button
                tone="secondary"
                aria-label="Previous photo"
                onClick={() => change(-1)}
              >
                <ChevronLeft aria-hidden="true" /> Previous
              </Button>
              <span role="status">
                {(active || 0) + 1} / {shown.length}
              </span>
              <Button
                tone="secondary"
                aria-label="Next photo"
                onClick={() => change(1)}
              >
                Next <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
export function VideoPlayer() {
  const [failed, setFailed] = useState(false);
  return (
    <section className="video-demo">
      <h2>A dance demonstration</h2>
      <p>
        Licensed demonstration clip: Charleston dance. This is not Dance Mania
        School, its curriculum or a school performance.
      </p>
      {failed ? (
        <div className="empty" role="status">
          This local demonstration video could not load.{" "}
          <External href="https://commons.wikimedia.org/wiki/File:Charleston-dance.webm">
            Open the licensed original
          </External>
          <Button tone="secondary" onClick={() => setFailed(false)}>
            Retry demonstration
          </Button>
        </div>
      ) : (
        <video
          controls
          playsInline
          preload="none"
          poster="/assets/dance-demo-poster.jpg"
          aria-label="Licensed Charleston dance demonstration"
          onError={() => setFailed(true)}
        >
          <source src="/assets/dance-demo.mp4" type="video/mp4" />
          <track
            kind="descriptions"
            src="/assets/dance-demo.vtt"
            srcLang="en"
            label="English visual description"
          />
          Your browser does not support video. Open the licensed original below.
        </video>
      )}
      <p className="small">
        ARTSEDGE / The Kennedy Center (2012), CC BY 3.0. Resized silent
        18-second excerpt. No autoplay. This excerpt is silent; visual
        description: a pair demonstrates Charleston steps, moving in time and
        changing weight with kicks.{" "}
        <External href="https://commons.wikimedia.org/wiki/File:Charleston-dance.webm">
          Original recording & CC BY 3.0 attribution
        </External>
      </p>
    </section>
  );
}
export function VideoArchive({ id }: { id: string }) {
  const group =
    historicalVideos.find((g) => g.id === id) || historicalVideos[0];
  return (
    <>
      <div className="recording-list">
        {group.clips.map((c) => (
          <article key={c.url}>
            <span className="status-label">Historical • 2019</span>
            <h2>{c.title}</h2>
            <p>
              Karls Aniscenko & Dayana Nikon. The source hosts this historical
              recording. Reuse rights and captions have not been established;
              open it deliberately on the original host.
            </p>
            <External href={c.url}>Open original school recording</External>
          </article>
        ))}
      </div>
      <VideoPlayer />
    </>
  );
}
