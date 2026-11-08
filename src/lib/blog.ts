import { ROUTES } from "@/lib/routes";
import { KEYWORDS } from "@/lib/seo";

/* Every blog post lives here as data. /blog/[slug] renders it, and the
   sitemap, RSS feed, llms.txt, llms-full.txt and BlogPosting schema all read
   the same entries, so a new post is one object added to BLOG_POSTS. */

export interface BlogStat {
  label: string;
  value: string;
}

export type ArticleBlock =
  | { kind: "intro"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  | { kind: "quote"; text: string };

export interface BlogPost {
  slug: string;
  href: string;
  eyebrow: string;
  title: string;
  /** h1 is split so the second half can carry the gradient. */
  titleLead: string;
  titleGrad: string;
  summary: string;
  /** Meta description: answer-first, under ~160 characters. */
  description: string;
  keywords: readonly string[];
  /** ISO dates (YYYY-MM-DD). */
  published: string;
  updated: string;
  visual: {
    top: string;
    main: string;
    badge: string;
    variant: "season" | "quiz";
  };
  linkText: string;
  stats: BlogStat[];
  statsPanel: { label: string; heading: string; note?: string };
  body: ArticleBlock[];
  /** Shown at the end of the post with FAQPage schema. Facts from the post only. */
  faq: { q: string; a: string }[];
  cta: string;
}

export const IPL_JOURNEY_POST: BlogPost = {
  slug: "ipl-2026-prediction-journey",
  href: ROUTES.iplJourney,
  eyebrow: "IPL 2026 · Community Report",
  title: "Our IPL 2026 Prediction Journey",
  titleLead: "Our IPL 2026",
  titleGrad: "Prediction Journey",
  summary:
    "A look at how the StatOz community read the game, backed its instincts, and turned every IPL match into a shared prediction experience.",
  description:
    "How 292 StatOz players made 479 IPL 2026 predictions, submitted 1,137 entries, and placed 80,471 Oz Coins.",
  keywords: [
    "IPL 2026 predictions",
    "IPL prediction game",
    "cricket prediction game",
    "IPL 2026 prediction stats",
    KEYWORDS.core[1],
  ],
  // TODO: replace with the real publish date if the post went live earlier.
  published: "2026-11-03",
  updated: "2026-11-09",
  visual: {
    top: "IPL",
    main: "2026",
    badge: "47.88%",
    variant: "season",
  },
  linkText: "Read the journey",
  stats: [
    { label: "Users played", value: "292" },
    { label: "Total submissions", value: "1,137" },
    { label: "Predictions made", value: "479" },
    { label: "Coins placed", value: "80,471" },
    { label: "Correct prediction rate", value: "47.88%" },
  ],
  statsPanel: { label: "Season snapshot", heading: "IPL 2026 in numbers" },
  body: [
    {
      kind: "intro",
      text: "Across IPL 2026, 292 StatOz players made 479 predictions, sent in 1,137 submissions and backed their calls with 80,471 Oz Coins, finishing with a 47.88% correct prediction rate. The season gave the StatOz community more than thrilling finishes and bold calls: it gave fans a season-long arena to test instincts, follow momentum, and experience every match with something extra on the line.",
    },
    { kind: "h2", text: "292 players joined the action" },
    {
      kind: "p",
      text: "Across the journey, 292 users stepped into the prediction arena. Every pick represented a point of view: a read on the match, a belief in a team, or a feeling that the game was about to turn.",
    },
    { kind: "h2", text: "From predictions to match-day momentum" },
    {
      kind: "p",
      text: "Together, the community made 479 predictions and sent in 1,137 total submissions. That activity turned fixtures into ongoing conversations, with players returning to back their judgment as the tournament unfolded.",
    },
    {
      kind: "quote",
      text: "The real win was seeing hundreds of fans read the game together -one prediction at a time.",
    },
    { kind: "h2", text: "80,471 Oz Coins backed those calls" },
    {
      kind: "p",
      text: "Players placed a combined 80,471 Oz Coins across their picks. Those coins carried no cash value; they were a simple way to express confidence, add friendly stakes, and make each outcome feel more meaningful.",
    },
    { kind: "h2", text: "A 47.88% correct prediction rate" },
    {
      kind: "p",
      text: "The final correct-prediction rate landed at 47.88%. In a tournament built on pressure, changing form, and surprise results, that number captures exactly why prediction games stay compelling: the game always has another twist.",
    },
    { kind: "h2", text: "What comes next" },
    {
      kind: "p",
      text: "This IPL journey is only one chapter. We are carrying everything we learned into the next set of contests, with more ways for fans to make picks, follow their accuracy, and climb together.",
    },
  ],
  faq: [
    {
      q: "How many people played IPL 2026 predictions on StatOz?",
      a: "292 StatOz players took part in IPL 2026 predictions. Together they made 479 predictions and sent in 1,137 submissions.",
    },
    {
      q: "What was the correct prediction rate for IPL 2026 on StatOz?",
      a: "The StatOz community finished IPL 2026 with a 47.88% correct prediction rate.",
    },
    {
      q: "Did the Oz Coins placed in IPL 2026 have any cash value?",
      a: "No. Players placed 80,471 Oz Coins across their IPL 2026 picks, and Oz Coins have no cash value. They are a free, virtual way to show confidence in a call.",
    },
  ],
  cta: "Join the next prediction",
};

export const PREDICTION_QUIZ_POST: BlogPost = {
  slug: "how-statoz-prediction-quiz-works",
  href: ROUTES.predictionQuizGuide,
  eyebrow: "Product Guide · How It Works",
  title: "How the StatOz Prediction Quiz Works",
  titleLead: "How the StatOz",
  titleGrad: "Prediction Quiz Works",
  summary:
    "Four questions, one match, and a simple test of how well you read the game -from pre-match picks to automatic settlement and XP.",
  description:
    "Learn how StatOz match quizzes work: answer four pre-match questions, lock picks at kickoff, earn XP after automatic settlement, and climb the leaderboards.",
  keywords: [
    "how the prediction quiz works",
    "match prediction quiz",
    "pre-match prediction quiz",
    "football prediction game",
    "XP leaderboard",
    KEYWORDS.core[1],
  ],
  // TODO: replace with the real publish date if the post went live earlier.
  published: "2026-11-03",
  updated: "2026-11-09",
  visual: {
    top: "4",
    main: "CALLS",
    badge: "XP AT FULL-TIME",
    variant: "quiz",
  },
  linkText: "How it works",
  stats: [
    { label: "Questions per match", value: "4" },
    { label: "Prediction lock", value: "Kickoff" },
    { label: "Settlement", value: "Automatic" },
    { label: "Correct answer reward", value: "XP" },
  ],
  statsPanel: {
    label: "The match flow",
    heading: "Quiz at a glance",
    note: "XP credit is live. Levels, streaks, and private leaderboards are coming soon.",
  },
  body: [
    {
      kind: "intro",
      text: "The StatOz Prediction Quiz gives you four questions about a real match, locks your answers at kickoff, grades them automatically at full-time and credits XP for every correct call. Watching a match is one thing. Calling what happens next makes every attack, booking, and final whistle feel different.",
    },
    { kind: "h2", text: "Four questions for every match" },
    {
      kind: "p",
      text: "Open a fixture and you will find four questions about the match ahead. They can cover the result, goalscorers, bookings, set pieces, and other key events. Answer one at a time and edit your calls freely while the quiz is open.",
    },
    { kind: "h2", text: "Your calls lock at kickoff" },
    {
      kind: "p",
      text: "The prediction window closes when the match begins. Once kickoff arrives, your four answers are locked, leaving you free to watch the action and see how your read of the game plays out.",
    },
    {
      kind: "quote",
      text: "Four questions. One fixture. Every answer is a chance to prove you read the game.",
    },
    { kind: "h2", text: "Full-time triggers automatic settlement" },
    {
      kind: "p",
      text: "After the match, StatOz automatically settles the quiz against the confirmed outcomes. There is nothing to claim and no score to enter manually. Your answers are graded and the result appears in the app.",
    },
    { kind: "h2", text: "Correct answers credit XP" },
    {
      kind: "p",
      text: "Every correct call earns XP. A wrong answer simply scores zero; it never removes XP you have already earned. Quiz predictions use XP only -Oz Coins are not staked on these questions.",
    },
    { kind: "h2", text: "Climb Match Day and League leaderboards" },
    {
      kind: "p",
      text: "Your credited XP determines where you rank. The Match Day leaderboard captures the immediate contest around the latest fixtures, while the League leaderboard tracks the longer race across the competition.",
    },
    { kind: "h2", text: "More ways to compete are coming soon" },
    {
      kind: "p",
      text: "XP credit is live today. Leveling, accuracy streaks, and private friend leaderboards are coming soon, alongside more ways to compare your reads and build a prediction identity over time. Launch dates will be shared when those features are ready.",
    },
    { kind: "h2", text: "Free to play, built for bragging rights" },
    {
      kind: "p",
      text: "StatOz uses virtual rewards with no cash value. There are no entry fees, deposits, cash stakes, or cash payouts in the Prediction Quiz -just your calls, your XP, and the leaderboard.",
    },
  ],
  faq: [
    {
      q: "When do StatOz predictions lock?",
      a: "StatOz predictions lock at kickoff. You can edit your answers freely until the match begins.",
    },
    {
      q: "Do wrong answers lose XP in StatOz?",
      a: "No. A wrong answer scores zero and never removes XP you have already earned. Every correct answer credits XP after automatic settlement at full-time.",
    },
    {
      q: "Are Oz Coins staked on the StatOz Prediction Quiz?",
      a: "No. The Prediction Quiz uses XP only. Oz Coins are not staked on quiz questions.",
    },
  ],
  cta: "Try the prediction quiz",
};

/* Newest first. */
export const BLOG_POSTS: BlogPost[] = [PREDICTION_QUIZ_POST, IPL_JOURNEY_POST];

export function getPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/* Plain-text version of a post for llms-full.txt. */
export function postToMarkdown(post: BlogPost) {
  const body = post.body
    .map((block) => {
      if (block.kind === "h2") return `### ${block.text}`;
      if (block.kind === "quote") return `> ${block.text}`;
      return block.text;
    })
    .join("\n\n");
  const stats = post.stats.map((s) => `- ${s.label}: ${s.value}`).join("\n");
  const faq = post.faq.map((item) => `**${item.q}** ${item.a}`).join("\n\n");
  return `${body}\n\n${post.statsPanel.heading}:\n${stats}${faq ? `\n\n${faq}` : ""}`;
}
