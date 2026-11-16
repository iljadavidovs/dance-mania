import { dancewear, evidence, rental, schoolEvent } from "./data";
import type { Evidence } from "./data";
export type Supplement = {
  id: string;
  label: string;
  title: string;
  intro: string;
  sections: { title: string; text: string }[];
  actions: { to: string; label: string }[];
  external?: { title: string; url: string }[];
  image?: string;
  contact?: boolean;
  choices?: boolean;
  groups?: { title: string; description: string; to: string }[];
  evidence: Evidence;
};
const fitting = {
  title: "Try before you choose",
  text: "Ask the school about fitting arrangements and current options. Stock, brands, prices and sizes are not verified. This local laboratory has no checkout or reservations.",
};
export function supplement(path: string): Supplement | undefined {
  if (path === "register")
    return {
      id: path,
      label: "Registration options",
      title: "Find your registration route",
      intro:
        "Choose the appropriate age division, then try a safe local demonstration.",
      sections: [
        {
          title: "Two separate age divisions",
          text: "Under 16 uses a guardian-oriented route. Age 16+ is the source’s individual registration division, not a legal adulthood statement.",
        },
        {
          title: "Keep the document labels separate",
          text: "Schedule documents use ages 4–25 and 25+. Their overlap at age 25 is preserved; those labels do not change the registration division.",
        },
      ],
      actions: [{ to: "schedule", label: "Read schedule documents" }],
      choices: true,
      evidence: evidence("registration-for-kids"),
    };
  if (path === "visit")
    return {
      id: path,
      label: "Your first visit",
      title: "Your first visit, with a little more clarity.",
      intro:
        "Explore the offer, check the documents and contact the school to arrange a visit.",
      sections: [
        {
          title: "Find an interest",
          text: "Choose one of the school’s four program families. Think about what you would like to explore, then ask which class may suit you.",
        },
        {
          title: "Read the documents",
          text: "Open the school’s current-period schedule and fee documents. Confirm a suitable group, lesson time and current arrangements directly.",
        },
        {
          title: "Arrange the visit",
          text: "Ask about a visit time, what to bring, parking, entrance arrangements and step-free access. These practical details have not been verified.",
        },
        {
          title: "A historical look inside",
          text: "The July 18, 2020 studio tour provides historical background, without confirming the current layout or condition.",
        },
      ],
      actions: [
        { to: "programs", label: "Explore programs" },
        { to: "schedule", label: "Schedules & fees" },
        { to: "contact-us", label: "Ask a visit question" },
        {
          to: "virtual-tour-of-mania-school",
          label: "Read the 2020 tour article",
        },
      ],
      contact: true,
      evidence: evidence("contact-us"),
    };
  if (path === "events")
    return {
      id: path,
      label: "Events archive",
      title: "The floor has a history.",
      intro:
        "Toronto Grand Cup — the school’s international DanceSport event archive.",
      sections: [
        { title: schoolEvent.name, text: schoolEvent.summary },
        {
          title: "An archive, not a future booking",
          text: "The poster advertises May 9–10, 2020. No future edition or current ticket availability has been confirmed.",
        },
      ],
      actions: [
        { to: "videos-shows", label: "Explore show recordings" },
        {
          to: "the-walk-of-fame",
          label: "Read about the world around competition",
        },
        { to: "contact-us", label: "Ask about events" },
      ],
      image: "latin",
      evidence: schoolEvent.evidence,
    };
  if (path === "rent")
    return {
      id: path,
      label: "Studio hire",
      title: "Make room for your event.",
      intro: "Studio and venue inquiries at Dance Mania School.",
      sections: [
        {
          title: "A space for a gathering",
          text: `The school’s rental page advertises space for special events and states “${rental.claim}”. This is a source claim, not a certified capacity or confirmation of today’s layout.`,
        },
        {
          title: "Discuss your event",
          text: "Rates, dates, facilities and availability are unknown. Ask the school about your plans and access requirements.",
        },
        {
          title: "Original venue recordings",
          text: "No other venue is substituted for the real studio. Original historical venue videos are linked below; reproduction rights and current conditions are not established.",
        },
      ],
      actions: [
        { to: "contact-us", label: "Try a studio-hire inquiry" },
        { to: "visit", label: "Visit information" },
      ],
      contact: true,
      external: rental.media.map((url, i) => ({
        title: `Open original venue video ${i + 1}`,
        url,
      })),
      evidence: rental.evidence,
    };
  if (path === "dance-clothes-for-sale-and-rent")
    return {
      id: path,
      label: "Dance clothing",
      title: "Dance clothing",
      intro: "The source catalogue says “Page Coming Soon”.",
      sections: [
        {
          title: "No clothing inventory is published.",
          text: "Sale and rental availability, sizes and prices have not been verified. Ask the school about what you need. This local prototype cannot reserve or sell clothing.",
        },
      ],
      actions: [
        { to: "contact-us", label: "Ask about clothing" },
        { to: "dance-shoes-for-sale", label: "Explore shoe categories" },
      ],
      evidence: dancewear.clothing.evidence,
    };
  if (path === "dance-shoes-for-sale")
    return {
      id: path,
      label: "Dance shoes",
      title: "A fitting starts with the right conversation.",
      intro:
        "Source-backed dance shoe categories, with a studio fitting and inquiry route.",
      sections: [fitting],
      groups: dancewear.audiences.map((a) => ({
        title: a.title,
        description: a.groups.join("; "),
        to: a.path,
      })),
      actions: [
        { to: "contact-us", label: "Ask about a fitting" },
        {
          to: "dance-clothes-for-sale-and-rent",
          label: "Dance clothing information",
        },
      ],
      evidence: evidence(path),
    };
  const shoes = dancewear.audiences.find((a) => a.path === path);
  if (shoes)
    return {
      id: path,
      label: `Shoes for ${shoes.title.toLowerCase()}`,
      title: `Shoes for ${shoes.title.toLowerCase()}`,
      intro:
        "Listed dance shoe categories and a direct route to ask about a fitting.",
      groups: shoes.groups.map((title) => ({
        title,
        description:
          "Listed on the source. Availability, stock, brands, prices and sizes need confirmation.",
        to: "contact-us",
      })),
      sections: [fitting],
      actions: [
        { to: "contact-us", label: "Ask about a fitting" },
        { to: "dance-shoes-for-sale", label: "All shoe audiences" },
      ],
      evidence: shoes.evidence,
    };
  if (path === "about-karls-aniscenko")
    return {
      id: path,
      label: "Historical author biography",
      title: "Karls Aniscenko",
      intro:
        "The site author’s historical biography, preserved as a distinct part of the school website.",
      sections: [
        {
          title: "A dancer’s perspective",
          text: "The source biography describes Karls as a professional Latin American dancer, reflecting on competition, practice and teaching. It names Dayana Nikon as his dance partner.",
        },
        {
          title: "Reading an older biography",
          text: "Its relative-time claims about experience, weekly practice and ambitions are historical statements. They are not recalculated or presented as verified current facts.",
        },
        {
          title: "Writing about dance",
          text: "His site byline connects six 2020 articles about lessons, performance, preparation and the language of movement. The handbook body separately credits Dayana.",
        },
      ],
      actions: [
        { to: "author/dancemaniaschool_ru3lje", label: "Read all six posts" },
        { to: "instructors/karls-aniscenko", label: "View the school listing" },
      ],
      external: [
        {
          title: "Original biography and historical achievements",
          url: "https://dancemaniaschool.com/about-karls-aniscenko/",
        },
      ],
      evidence: evidence(path, "historical"),
    };
  return undefined;
}
