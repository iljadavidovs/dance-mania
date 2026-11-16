import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LocalLink, ResultContext, useVariant } from "./core";
import { registrationDefinitions } from "../domain/data";
import { Button } from "./ui/button";
const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter an invented name of at least 2 characters.")
    .max(100, "Use 100 characters or fewer."),
  email: z
    .email("Enter a valid invented email, such as parent@example.test.")
    .max(200),
  phone: z
    .string()
    .trim()
    .refine(
      (v) =>
        /^[+()\d\s.-]+$/.test(v) &&
        v.replace(/\D/g, "").length >= 7 &&
        v.replace(/\D/g, "").length <= 15,
      "Enter a phone with 7–15 digits; +, spaces and brackets are allowed.",
    ),
  guardian: z.string().max(100),
  interest: z.string().min(1, "Choose an interest."),
  referral: z.string(),
  message: z.string().max(1500, "Use 1,500 characters or fewer."),
});
type Values = z.infer<typeof schema>;
const defaults: Values = {
  name: "",
  email: "",
  phone: "",
  guardian: "",
  interest: "",
  referral: "",
  message: "",
};
export function DemoForm({ kind }: { kind: "kids" | "adults" | "inquiry" }) {
  const variant = useVariant();
  const { setCompleted } = useContext(ResultContext);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "failure"
  >("idle");
  const [scenario, setScenario] = useState("success");
  const [review, setReview] = useState(false);
  const generation = useRef(0);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const submit = handleSubmit(async () => {
    if (variant === "interactive" && !review) {
      setReview(true);
      return;
    }
    const attempt = ++generation.current;
    setStatus("pending");
    await new Promise((r) => setTimeout(r, 650));
    if (!alive.current || attempt !== generation.current) return;
    if (scenario === "failure") {
      setStatus("failure");
      return;
    }
    setStatus("success");
    setCompleted(true);
    reset(defaults);
    setReview(false);
  });
  const clear = () => {
    generation.current++;
    reset(defaults);
    setStatus("idle");
    setReview(false);
    setCompleted(false);
  };
  return (
    <div className="demo-form">
      <div className="demo-notice">
        <strong>Local demonstration.</strong> Use invented details only. Nothing
        is sent to Dance Mania School.
      </div>
      <p className="small">
        {registrationDefinitions.find((d) => d.id === kind)?.context} Required
        fields are labelled.
      </p>
      {variant === "interactive" && (
        <p className="form-progress">
          {review
            ? "Step 2 of 2 — review your demonstration"
            : "Step 1 of 2 — your demonstration details"}
        </p>
      )}
      <form
        onSubmit={submit}
        noValidate
        autoComplete="off"
        aria-label={`${kind} local demonstration`}
      >
        {review ? (
          <section className="review-values">
            <h2>Review invented details</h2>
            <dl>
              {Object.entries(getValues())
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
            </dl>
            <Button
              type="button"
              tone="secondary"
              onClick={() => setReview(false)}
            >
              Edit details
            </Button>
          </section>
        ) : (
          <div className="form-fields">
            <label htmlFor="demo-name">
              {kind === "kids" ? "Invented dancer name" : "Invented full name"}{" "}
              (required)
              <input
                id="demo-name"
                {...register("name")}
                autoComplete="off"
                placeholder="Demo Dancer"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <span id="name-error" className="field-error">
                  {errors.name.message}
                </span>
              )}
            </label>
            {kind === "kids" && (
              <label htmlFor="demo-guardian">
                Invented guardian name (optional)
                <input
                  id="demo-guardian"
                  {...register("guardian")}
                  autoComplete="off"
                  placeholder="Demo Guardian"
                />
              </label>
            )}
            <label htmlFor="demo-email">
              {kind === "kids" ? "Guardian demo email" : "Demo email"}{" "}
              (required)
              <input
                id="demo-email"
                type="email"
                {...register("email")}
                autoComplete="off"
                spellCheck={false}
                placeholder="parent@example.test"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span id="email-error" className="field-error">
                  {errors.email.message}
                </span>
              )}
            </label>
            <label htmlFor="demo-phone">
              Demo contact phone (required)
              <input
                id="demo-phone"
                type="tel"
                {...register("phone")}
                autoComplete="off"
                placeholder="+1 202 555 0123"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <span id="phone-error" className="field-error">
                  {errors.phone.message}
                </span>
              )}
            </label>
            <label htmlFor="demo-interest">
              Interest (required)
              <select
                id="demo-interest"
                {...register("interest")}
                aria-invalid={!!errors.interest}
                aria-describedby={
                  errors.interest ? "interest-error" : undefined
                }
              >
                <option value="">Choose an interest</option>
                {[
                  "Classes for children",
                  "Classes for myself",
                  "Competitive dancing",
                  "Studio hire",
                  "Shoe fitting",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              {errors.interest && (
                <span id="interest-error" className="field-error">
                  {errors.interest.message}
                </span>
              )}
            </label>
            {kind !== "inquiry" && (
              <label htmlFor="demo-referral">
                How did you hear about the school? (optional)
                <select id="demo-referral" {...register("referral")}>
                  <option value="">Choose a referral</option>
                  <option>Search</option>
                  <option>Friend or family</option>
                  <option>Social media</option>
                  <option>Other</option>
                </select>
              </label>
            )}
            {kind === "inquiry" && (
              <label className="wide-field" htmlFor="demo-message">
                Invented message (optional)
                <textarea
                  id="demo-message"
                  {...register("message")}
                  placeholder="Ask a demonstration question…"
                  rows={4}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <span className="field-error">{errors.message.message}</span>
                )}
              </label>
            )}
          </div>
        )}
        <div className="form-actions">
          <Button type="submit" disabled={status === "pending"}>
            {status === "pending"
              ? "Running local simulation…"
              : variant === "interactive" && !review
                ? "Review demo details"
                : "Complete local demo"}
          </Button>
          <Button type="button" tone="secondary" onClick={clear}>
            Reset form
          </Button>
        </div>
        <div
          role="status"
          aria-live="polite"
          className={`form-status ${status}`}
        >
          {status === "success" && (
            <>
              <p>
                Demo completed locally. No information was sent and no
                enrollment or inquiry was created.
              </p>
              <LocalLink to="thank-you">View local demo result</LocalLink>
            </>
          )}
          {status === "failure" && (
            <p>
              Simulated failure. Nothing was sent. Your invented details remain
              editable; retry or reset the form.
            </p>
          )}
          {status === "pending" && (
            <p>Processing only in this browser. No network request is made.</p>
          )}
        </div>
      </form>
      <details className="test-controls">
        <summary>Laboratory test controls</summary>
        <label>
          Simulation outcome
          <select
            aria-label="Simulation outcome"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
          >
            <option value="success">Simulated success</option>
            <option value="failure">Simulated failure</option>
          </select>
        </label>
        <p className="small">
          A deterministic local test control, not a school service.
        </p>
      </details>
      {kind === "kids" ? (
        <LocalLink to="registration-for-adults">
          Looking for age 16+ registration?
        </LocalLink>
      ) : kind === "adults" ? (
        <LocalLink to="registration-for-kids">
          Looking for under-16 registration?
        </LocalLink>
      ) : (
        <LocalLink to="register">Explore registration options</LocalLink>
      )}
    </div>
  );
}
