export type Variant = "interactive" | "minimal" | "vision";
export type Evidence = {
  source: string;
  observed: string;
  confidence: "high" | "medium";
  status: "verified" | "unknown" | "sample";
  time: "current" | "historical" | "unknown";
  rights: string;
};
const source = "https://dancemaniaschool.com";
export const evidence = (
  path: string,
  time: Evidence["time"] = "unknown",
): Evidence => ({
  source: `${source}/${path}${path ? "/" : ""}`,
  observed: "2026-11-16",
  confidence: "high",
  status: "verified",
  time,
  rights: "Original factual summary; source photos and recordings not copied.",
});
export type Program = {
  id: string;
  name: string;
  audience: "Children" | "Adults" | "Ask the school";
  goal: "Competitive" | "Recreational" | "Social";
  style: string;
  dances: string[];
  summary: string;
  image: string;
  evidence: Evidence;
};
export const programs: Program[] = [
  {
    id: "latin",
    name: "Competitive Latin",
    audience: "Ask the school",
    goal: "Competitive",
    style: "Latin",
    dances: ["Samba", "Cha-Cha-Cha", "Rumba", "Paso-Doble", "Jive"],
    summary:
      "Explore five Latin dances, from the measured character of Rumba to the rhythm of Jive. Ask the school about a suitable group or private lesson.",
    image: "latin",
    evidence: evidence("programs"),
  },
  {
    id: "standard",
    name: "Competitive Standard",
    audience: "Ask the school",
    goal: "Competitive",
    style: "Standard",
    dances: [
      "Slow Waltz",
      "Tango",
      "Viennese Waltz",
      "Slow Foxtrot",
      "Quickstep",
    ],
    summary:
      "A five-dance ballroom discipline built around movement in partnership. The source lists the dances; group levels and age eligibility need confirmation.",
    image: "tango",
    evidence: evidence("programs"),
  },
  {
    id: "children",
    name: "Recreational children",
    audience: "Children",
    goal: "Recreational",
    style: "Ask the school",
    dances: [],
    summary:
      "A recreational route for children. Contact the school to discuss the child’s interests, suitable age group and current class options.",
    image: "waltz",
    evidence: evidence("programs"),
  },
  {
    id: "social",
    name: "Adult social",
    audience: "Adults",
    goal: "Social",
    style: "Social, Latin & Standard",
    dances: [
      "Salsa",
      "Bachata",
      "Merengue",
      "Argentine Tango",
      "Line Dance",
      "Latin dances",
      "Standard dances",
    ],
    summary:
      "Explore social dancing through Salsa, Bachata, Merengue, Argentine Tango and Line Dance, alongside Latin and Standard dances.",
    image: "jive",
    evidence: evidence("programs"),
  },
];
export type Person = {
  id: string;
  name: string;
  role: "Teacher" | "Instructor";
  initials: string;
  evidence: Evidence;
};
export const people: Person[] = [
  "Igor Nikon",
  "Yelena Nikon",
  "Dayana Nikon",
  "Karls Aniscenko",
  "Andrey Lobankov",
  "Liana Koroleva",
  "Dennis Gluskin",
  "Anna Perzan",
  "Ariella Shribman",
  "Tamir Azbel",
].map((name, i) => ({
  id: name.toLowerCase().replaceAll(" ", "-"),
  name,
  role: i < 6 ? "Teacher" : "Instructor",
  initials: name
    .split(" ")
    .map((n) => n[0])
    .join(""),
  evidence: evidence("instructors"),
}));
export type ScheduleDocument = {
  id: string;
  title: string;
  period: string;
  audience: string;
  type: "Classes" | "Fees" | "Camp";
  archive: boolean;
  url: string;
  evidence: Evidence;
};
export const documents: ScheduleDocument[] = [
  {
    id: "year",
    title: "September 2026–June 2027 class schedule",
    period: "2026–2027",
    audience: "Ages 4–25",
    type: "Classes",
    archive: false,
    url: "https://drive.google.com/file/d/1b1r3NL9T-ufs1IwlqEpg66Q24tSsycl1/view?usp=sharing",
    evidence: evidence("schedule", "current"),
  },
  {
    id: "adults",
    title: "Adults class schedule 2026–2027",
    period: "2026–2027",
    audience: "Age 25+",
    type: "Classes",
    archive: false,
    url: "https://drive.google.com/file/d/1eBpIzSLsowUQKYsP-njUcftIWlAPSPRR/view?usp=sharing",
    evidence: evidence("schedule", "current"),
  },
  {
    id: "fees",
    title: "Fee schedule",
    period: "2026–2027",
    audience: "Not specified",
    type: "Fees",
    archive: false,
    url: "https://drive.google.com/file/d/1gnlHZc73z6Gfu-GqGRyLaCx7UGK_ZiRe/view?usp=sharing",
    evidence: evidence("schedule"),
  },
  {
    id: "summer",
    title: "July–August 2026 summer class schedule",
    period: "Summer 2026",
    audience: "Ages 4–25",
    type: "Classes",
    archive: true,
    url: "https://drive.google.com/file/d/1pREqRX0_SjTBVmb07gvLbmeCXyzECUdm/view?usp=sharing",
    evidence: evidence("schedule", "historical"),
  },
  {
    id: "camp",
    title: "Summer camp 2026",
    period: "Summer 2026",
    audience: "Not specified",
    type: "Camp",
    archive: true,
    url: "https://drive.google.com/file/d/1YbHuClHePBSY5k-kifQBD9aiRxWiFu48/view?usp=sharing",
    evidence: evidence("schedule", "historical"),
  },
];
export const documentNotes: Record<string, string> = {
  year: "The September 2026–June 2027 source PDF lists group classes for ages 4–25. Use the original grid for exact days, times and groups; confirm a suitable place directly.",
  adults:
    "The readable two-page source lists adult Latin groups, a ladies Latin style class and a social dance party. Confirm the current timetable and suitable level with the school.",
  fees: "The readable Fall–Winter 2026–2027 fee document covers September 1, 2026–January 30, 2027, with group session tiers, private lesson fees and terms. Read both pages and confirm current applicability directly.",
  summer:
    "A readable scanned class grid for July–August 2026. This is historical, not a current timetable.",
  camp: "The readable source describes August 10–14 and August 17–21, 2026 camp weeks. Those dates and its registration deadline have passed.",
};
export type Article = {
  id: string;
  title: string;
  date: string;
  categories: ("For anyone" | "For dancers")[];
  summary: string;
  sections: { title: string; body: string }[];
  media: { title: string; url: string }[];
  credit: string;
  evidence: Evidence;
};
export const articles: Article[] = [
  {
    id: "a-lesson-at-dance-mania-school",
    title: "A lesson at Dance Mania School",
    date: "2020-08-02",
    categories: ["For anyone"],
    summary:
      "Three lesson recordings offer a historical glimpse of Cha-Cha-Cha, Rumba and Jive with Karls Aniscenko and Dayana Nikon.",
    sections: [
      {
        title: "Three dances, three different characters",
        body: "The original post brings together Cha-Cha-Cha, Rumba and Jive clips. Watch for changes in rhythm, timing and the relationship between partners. These are recordings from the 2020 editorial archive, not a current lesson plan.",
      },
      {
        title: "From watching to taking part",
        body: "The recordings can help you find a style you would like to explore. For current teaching arrangements, use the program descriptions and ask the school which group or private lesson may suit you.",
      },
    ],
    media: [
      {
        title: "Cha-Cha-Cha lesson",
        url: "https://www.youtube.com/watch?v=yWe6BahC2Mo",
      },
      {
        title: "Rumba lesson",
        url: "https://www.youtube.com/watch?v=Nk7pgpl4zlQ",
      },
      {
        title: "Jive lesson",
        url: "https://www.youtube.com/watch?v=6oKY3HAXH3s",
      },
    ],
    credit: "Site byline: Karls Aniscenko",
    evidence: evidence("a-lesson-at-dance-mania-school", "historical"),
  },
  {
    id: "the-walk-of-fame",
    title: "The walk of fame",
    date: "2020-08-02",
    categories: ["For anyone", "For dancers"],
    summary:
      "An introduction to WDSF red-carpet material from 2018 and 2019, celebrating the atmosphere around international DanceSport.",
    sections: [
      {
        title: "The atmosphere around the floor",
        body: "This archive entry points to WDSF red-carpet recordings from 2018 and 2019. It offers a view of the presentation and personalities around competition, rather than a record of awards won by Dance Mania School.",
      },
      {
        title: "A historical reference",
        body: "The publication date is August 2020. Competition calendars, participants and governing rules change; these recordings belong to their original context.",
      },
    ],
    media: [
      {
        title: "WDSF red-carpet reference 1",
        url: "https://www.youtube.com/watch?v=72vCG3FOfcg",
      },
      {
        title: "WDSF red-carpet reference 2",
        url: "https://www.youtube.com/watch?v=JCoRbOm8Eg4",
      },
    ],
    credit: "Site byline: Karls Aniscenko",
    evidence: evidence("the-walk-of-fame", "historical"),
  },
  {
    id: "instructions-for-dancers",
    title: "Instructions for dancers",
    date: "2020-07-26",
    categories: ["For dancers"],
    summary:
      "A historical dancer’s handbook about preparation, practice and the responsibilities around learning and competing.",
    sections: [
      {
        title: "Preparing for the work",
        body: "The handbook discusses the habits surrounding dance practice and competition. Read it as an archived perspective on taking training seriously, rather than a current school policy or an individualized health or training prescription.",
      },
      {
        title: "An attribution worth preserving",
        body: "The site lists Karls Aniscenko as the post’s author, while the body credits Dayana. Both relationships are retained here. Ask the school directly for its current expectations and practical instructions.",
      },
    ],
    media: [],
    credit: "Body credit: Dayana Nikon. Site byline: Karls Aniscenko.",
    evidence: evidence("instructions-for-dancers", "historical"),
  },
  {
    id: "how-dancing-is-evaluated-on-the-competitions",
    title: "How dancing is evaluated at competitions",
    date: "2020-07-25",
    categories: ["For dancers"],
    summary:
      "A dancer’s perspective on posture, rhythm, frame, balance, partnership and movement around the floor.",
    sections: [
      {
        title: "The individual and the partnership",
        body: "The essay considers posture, balance and rhythm alongside frame and the connection between partners. Its vocabulary helps a newcomer look beyond individual steps and notice how a couple moves together.",
      },
      {
        title: "Using the floor",
        body: "Distance, direction and floor craft matter to the whole performance. The article presents an editorial view from 2020; it is not a current official judging rulebook. Consult the relevant competition organizer for applicable rules.",
      },
    ],
    media: [],
    credit: "Site byline: Karls Aniscenko",
    evidence: evidence(
      "how-dancing-is-evaluated-on-the-competitions",
      "historical",
    ),
  },
  {
    id: "virtual-tour-of-mania-school",
    title: "A virtual tour of Dance Mania School",
    date: "2020-07-18",
    categories: ["For anyone"],
    summary:
      "A 2020 tour offers historical first-visit context. Confirm current studio arrangements directly before visiting.",
    sections: [
      {
        title: "A look inside, in 2020",
        body: "The original post links to a video tour of Dance Mania School. It can provide historical context for the studio, but the recording does not establish its present layout, access arrangements or facilities.",
      },
      {
        title: "Plan a visit today",
        body: "The contact page lists 245 West Beaver Creek Road, Unit 5A, Richmond Hill. Ask the school about a suitable visit time, entrance arrangements and anything you need for your first lesson. No current opening hours or parking details have been verified.",
      },
    ],
    media: [
      {
        title: "Watch the July 2020 studio tour on YouTube",
        url: "https://www.youtube.com/watch?v=00eltU4v7h0",
      },
    ],
    credit: "Site byline: Karls Aniscenko",
    evidence: evidence("virtual-tour-of-mania-school", "historical"),
  },
  {
    id: "if-words-were-movements",
    title: "If words were movements",
    date: "2020-07-12",
    categories: ["For anyone"],
    summary:
      "An editorial reference to “The Statement” explores how movement can carry a conversation without words.",
    sections: [
      {
        title: "Movement as language",
        body: "This archive entry references the dance film “The Statement”. It invites readers to consider expression, relationships and narrative through movement, rather than presenting a recording of the school.",
      },
      {
        title: "Accessing the original reference",
        body: "The original link is hosted on Facebook and may require an account or be unavailable. No transcript or reproduction rights were established. A descriptive external link preserves the reference without an overflowing raw URL.",
      },
    ],
    media: [
      {
        title: "Open “The Statement” reference on Facebook",
        url: "https://www.facebook.com/100011686715349/videos/1126756247723922/",
      },
    ],
    credit: "Site byline: Karls Aniscenko",
    evidence: evidence("if-words-were-movements", "historical"),
  },
];
export const contact = {
  school: "Dance Mania School",
  owners: ["Igor Nikon", "Yelena Nikon"],
  address:
    "245 West Beaver Creek Road, Unit 5A, Richmond Hill, Ontario, L4B 1L1",
  email: "igornikon.dm@gmail.com",
  phone: "647-284-1546",
  evidence: evidence("contact-us", "current"),
};
export const images = [
  {
    id: "latin",
    src: "/assets/latin.jpg",
    title: "Latin partnership, Berlin 2016",
    category: "Latin",
    alt: "A Latin dance couple performing in close partnership at a competition in Berlin.",
    credit: "Hold me close — Thomas Quine / CC BY 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Hold_me_close_-_Latin_Dance_competition,_Blaues_Band_der_Spree,_Berlin_2016.jpg",
  },
  {
    id: "tango",
    src: "/assets/tango-exhibition.jpg",
    title: "Tango exhibition, Prague",
    category: "Standard",
    alt: "A couple performs a ballroom tango at the Prague Congress Center, an illustrative photograph.",
    credit: "che / CC BY-SA 2.5",
    source:
      "https://commons.wikimedia.org/wiki/File:Ballroom_dance_exhibition.jpg",
  },
  {
    id: "waltz",
    src: "/assets/waltz.jpg",
    title: "A waltz partnership",
    category: "Standard",
    alt: "A couple dancing the waltz at UMass Amherst, an illustrative archive photograph.",
    credit: "Waltz UMass Amherst / public domain",
    source: "https://commons.wikimedia.org/wiki/File:Waltz_UMass_Amherst.jpg",
  },
  {
    id: "jive",
    src: "/assets/jive.jpg",
    title: "Jive at a British dance hall, 1945",
    category: "Archive",
    alt: "Black and white archive photograph of a couple trying jive steps in 1945.",
    credit: "Ministry of Information / public domain",
    source:
      "https://commons.wikimedia.org/wiki/File:A_couple_at_a_British_dance_hall_try_out_%27jive%27_steps_in_1945._D23826.jpg",
  },
];
export const historicalVideos = [
  {
    id: "videos-competitions",
    title: "Competition recordings",
    clips: [
      {
        title: "Samba, Los Angeles, 2019",
        url: `${source}/wp-content/uploads/2020/09/Samba.mp4`,
      },
      {
        title: "Solo Samba, Nanaimo Open, 2019",
        url: `${source}/wp-content/uploads/2020/09/Samba-Solo.mp4`,
      },
    ],
  },
  {
    id: "videos-shows",
    title: "Show recordings",
    clips: [
      {
        title: "Samba show, Toronto Grand Cup, 2019",
        url: `${source}/wp-content/uploads/2020/09/Samba-Show.mp4`,
      },
      {
        title: "“Cat” Jive show, Nanaimo Open, 2019",
        url: `${source}/wp-content/uploads/2020/09/Cat-Show.m4v`,
      },
    ],
  },
];
export const sourcePaths = [
  "",
  "programs",
  "schedule",
  "instructors",
  "registration-for-kids",
  "contact-us",
  "events",
  "photos",
  "videos-competitions",
  "videos-shows",
  "dance-shoes-for-sale",
  "dance-clothes-for-sale-and-rent",
  "rent",
  "dance-mania-blog",
  ...articles.map((a) => a.id),
  "about-karls-aniscenko",
  "author/dancemaniaschool_ru3lje",
  "shoes-for-gentlemen",
  "shoes-for-ladies",
  "shoes-for-kids",
  "registration-for-adults",
  "thank-you",
  "category/for-anyone",
  "category/for-dancers",
];
export const extraPaths = [
  "register",
  "visit",
  ...programs.map((p) => `programs/${p.id}`),
  ...people.map((p) => `instructors/${p.id}`),
];
export const variants: { id: Variant; name: string; description: string }[] = [
  {
    id: "interactive",
    name: "Rhythm Room",
    description:
      "Expressive rhythm. Useful discovery. A lively route into Latin and ballroom.",
  },
  {
    id: "minimal",
    name: "Quiet Form",
    description:
      "An edited catalogue. Precise typography. Every interaction is instantaneous.",
  },
  {
    id: "vision",
    name: "Frame & Floor",
    description:
      "Partnership as a design language. A considered path to your first studio visit.",
  },
];
export const dateLabel = (date: string) =>
  new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date + "T12:00:00Z"));

// Source records for the secondary page families. Evidence and time context remain independent.
export const schoolEvent: {
  id: string;
  name: string;
  posterDates: string;
  summary: string;
  availability: "unknown";
  evidence: Evidence;
} = {
  id: "toronto-grand-cup",
  name: "Toronto Grand Cup",
  posterDates: "May 9–10, 2020",
  summary:
    "The source poster advertises May 9–10, 2020. The page describes an international WDSF competition where couples come together to compete and perform.",
  availability: "unknown",
  evidence: evidence("events", "historical"),
};
export const rental: {
  claim: string;
  capacityVerified: boolean;
  availability: "unknown";
  rates: "unknown";
  media: string[];
  evidence: Evidence;
} = {
  claim: "up to 150 seats",
  capacityVerified: false,
  availability: "unknown",
  rates: "unknown",
  media: [
    "https://dancemaniaschool.com/wp-content/uploads/2020/09/Video.mp4",
    "https://dancemaniaschool.com/wp-content/uploads/2020/09/Video2.mp4",
  ],
  evidence: evidence("rent"),
};
export const registrationDefinitions: {
  id: "kids" | "adults" | "inquiry";
  path: string;
  context: string;
  fields: string[];
  evidence: Evidence;
}[] = [
  {
    id: "kids",
    path: "registration-for-kids",
    context:
      "Under 16: a guardian explores registration using invented details.",
    fields: [
      "dancer name",
      "guardian contact email",
      "guardian phone",
      "guardian name",
      "referral",
    ],
    evidence: evidence("registration-for-kids"),
  },
  {
    id: "adults",
    path: "registration-for-adults",
    context:
      "Age 16+: this is the source registration division, not a legal adulthood statement.",
    fields: ["full name", "email", "phone", "referral"],
    evidence: evidence("registration-for-adults"),
  },
  {
    id: "inquiry",
    path: "contact-us",
    context:
      "Try a class, studio hire or shoe fitting inquiry with synthetic details.",
    fields: [
      "name",
      "interest",
      "phone",
      "email",
      "optional message (local usability addition)",
    ],
    evidence: evidence("contact-us"),
  },
];
export const author = {
  id: "dancemaniaschool_ru3lje",
  name: "Karls Aniscenko",
  biographyPath: "about-karls-aniscenko",
  articleIDs: articles.map((a) => a.id),
  evidence: evidence("about-karls-aniscenko", "historical"),
};
export const categories = ["For anyone", "For dancers"].map((name) => ({
  id: name === "For anyone" ? "for-anyone" : "for-dancers",
  name,
  articleIDs: articles
    .filter((a) => a.categories.includes(name as "For anyone"))
    .map((a) => a.id),
  evidence: evidence(
    `category/${name === "For anyone" ? "for-anyone" : "for-dancers"}`,
    "historical",
  ),
}));
export const dancewear = {
  audiences: [
    {
      path: "shoes-for-gentlemen",
      title: "Gentlemen",
      groups: ["Latin", "Standard"],
    },
    {
      path: "shoes-for-ladies",
      title: "Ladies",
      groups: ["Latin", "Standard"],
    },
    {
      path: "shoes-for-kids",
      title: "Children",
      groups: ["Boys Latin", "Boys Standard", "Girls Latin / Standard"],
    },
  ].map((g) => ({ ...g, evidence: evidence(g.path) })),
  inventory: "unknown",
  clothing: {
    status: "unknown",
    sourceLabel: "Page Coming Soon",
    evidence: evidence("dance-clothes-for-sale-and-rent"),
  },
} as const;
