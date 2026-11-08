import { IPL_JOURNEY_POST, PREDICTION_QUIZ_POST, type ArticleBlock, type BlogStat } from "@/lib/blog";
import { ROUTES } from "@/lib/routes";

/* League landing pages at /predictions/[league]. Each targets one league's
   searches ("Premier League prediction game", "IPL prediction game").
   Facts come only from what the site already states; keep them in step with
   FAQ_ITEMS and the blog posts. */

export interface LeaguePage {
  slug: string;
  href: string;
  /** Short name for links, e.g. "EPL predictions". */
  name: string;
  title: string;
  titleLead: string;
  titleGrad: string;
  eyebrow: string;
  lead: string;
  description: string;
  keywords: readonly string[];
  variant: "season" | "quiz";
  body: ArticleBlock[];
  faq: { q: string; a: string }[];
  stats: BlogStat[];
  statsPanel: { label: string; heading: string; note?: string };
  related: { href: string; title: string; slug: string }[];
  cta: string;
}

export const EPL_PAGE: LeaguePage = {
  slug: "epl",
  href: ROUTES.eplPredictions,
  name: "EPL predictions",
  title: "Free Premier League Prediction Game",
  titleLead: "Free Premier League",
  titleGrad: "Prediction Game",
  eyebrow: "Football · English Premier League",
  lead: "Predict every Premier League fixture for free. Four quick questions per match, XP for every correct call, and a leaderboard to prove you read the game.",
  description:
    "Predict Premier League matches free on StatOz: four pre-match questions per fixture, XP for every correct call and a global leaderboard. No cash, not gambling.",
  keywords: [
    "EPL predictions",
    "Premier League prediction game",
    "free Premier League predictions",
    "EPL prediction app",
    "Premier League quiz",
    "football prediction game",
  ],
  variant: "quiz",
  body: [
    {
      kind: "intro",
      text: "StatOz is a free Premier League prediction game. Before each EPL fixture you answer four quick questions, your answers lock at kickoff, and every correct call earns XP that ranks you against other fans. There is no real money involved.",
    },
    { kind: "h2", text: "Four calls on every EPL fixture" },
    {
      kind: "p",
      text: "Open a Premier League match and answer four pre-match questions. They can cover the result, goalscorers, bookings, set pieces and other key events. Edit your answers freely until kickoff, when they lock.",
    },
    { kind: "h2", text: "Back your strongest reads with Picks" },
    {
      kind: "p",
      text: "Picks let you back the calls you are most sure of with Oz Coins, the free in-app currency. Drop a 2× or 1.5× booster on your best calls. Oz Coins are earned in the app and have no cash value.",
    },
    { kind: "h2", text: "Settled automatically at full-time" },
    {
      kind: "p",
      text: "After the final whistle, StatOz grades every answer against the confirmed result. Correct answers credit XP. A wrong answer scores zero and never takes away XP you have already earned.",
    },
    { kind: "h2", text: "Climb the Match Day and League leaderboards" },
    {
      kind: "p",
      text: "Your XP decides where you rank. The Match Day leaderboard covers the latest fixtures, while the League leaderboard tracks the longer race across the season.",
    },
    { kind: "h2", text: "Free to play, not gambling" },
    {
      kind: "p",
      text: "There are no entry fees, deposits, cash stakes or cash payouts. StatOz is a skill-based game: it comes down to how well you read the Premier League.",
    },
  ],
  faq: [
    {
      q: "Is there a free Premier League prediction game?",
      a: "Yes. StatOz is a free Premier League prediction game for Android, iOS and the web. You answer four questions before each EPL match and earn XP for every correct call.",
    },
    {
      q: "How do EPL predictions work on StatOz?",
      a: "Each EPL fixture has four pre-match questions. Answers lock at kickoff, StatOz settles them automatically at full-time, and correct answers credit XP that ranks you on the leaderboards.",
    },
    {
      q: "Can I win money predicting Premier League matches on StatOz?",
      a: "No. StatOz uses virtual XP and Oz Coins with no cash value. There are no deposits, cash stakes or cash payouts.",
    },
  ],
  stats: [
    { label: "Questions per match", value: "4" },
    { label: "Prediction lock", value: "Kickoff" },
    { label: "Settlement", value: "Automatic" },
    { label: "Price", value: "Free" },
  ],
  statsPanel: { label: "Premier League", heading: "How it works" },
  related: [PREDICTION_QUIZ_POST],
  cta: "Predict the next EPL fixture",
};

export const IPL_PAGE: LeaguePage = {
  slug: "ipl",
  href: ROUTES.iplPredictions,
  name: "IPL predictions",
  title: "Free IPL Prediction Game",
  titleLead: "Free IPL",
  titleGrad: "Prediction Game",
  eyebrow: "Cricket · Indian Premier League",
  lead: "Call IPL matches before they start, back your strongest picks with free Oz Coins, and climb the leaderboard with fans across India.",
  description:
    "Predict IPL matches free on StatOz. In IPL 2026, 292 players made 479 predictions with a 47.88% correct rate. No cash, not gambling.",
  keywords: [
    "IPL prediction game",
    "IPL predictions",
    "free IPL prediction app",
    "cricket prediction game",
    "IPL quiz",
    "IPL 2026 predictions",
  ],
  variant: "season",
  body: [
    {
      kind: "intro",
      text: "StatOz is a free IPL prediction game. You make calls on real IPL matches before they start, back your strongest picks with free Oz Coins and earn XP for correct predictions. In IPL 2026, 292 StatOz players made 479 predictions and finished with a 47.88% correct prediction rate.",
    },
    { kind: "h2", text: "How IPL predictions work" },
    {
      kind: "p",
      text: "Pick a match, answer the pre-match questions and back the calls you trust with Picks. Your predictions lock when the match begins. Once it is over, StatOz settles every answer automatically and credits XP for each correct call.",
    },
    { kind: "h2", text: "IPL 2026 on StatOz" },
    {
      kind: "p",
      text: "Across IPL 2026, 292 players made 479 predictions, sent in 1,137 submissions and placed 80,471 Oz Coins on their picks. The community's correct prediction rate was 47.88%.",
    },
    { kind: "h2", text: "No cash, just bragging rights" },
    {
      kind: "p",
      text: "Oz Coins and XP are virtual and free to earn, with no cash value. There are no deposits, entry fees, cash stakes or cash payouts on StatOz.",
    },
  ],
  faq: [
    {
      q: "Is there a free IPL prediction game?",
      a: "Yes. StatOz runs free IPL predictions and Picks on Android, iOS and the web. Correct calls earn XP, and there is no real money involved.",
    },
    {
      q: "How accurate were StatOz players in IPL 2026?",
      a: "The StatOz community finished IPL 2026 with a 47.88% correct prediction rate across 479 predictions from 292 players.",
    },
    {
      q: "Can I win money predicting IPL matches on StatOz?",
      a: "No. StatOz uses virtual XP and Oz Coins with no cash value. There are no deposits, cash stakes or cash payouts.",
    },
  ],
  stats: IPL_JOURNEY_POST.stats,
  statsPanel: { label: "IPL 2026 on StatOz", heading: "Season in numbers" },
  related: [IPL_JOURNEY_POST, PREDICTION_QUIZ_POST],
  cta: "Get StatOz for the IPL",
};

export const LEAGUE_PAGES: LeaguePage[] = [EPL_PAGE, IPL_PAGE];

export function getLeague(slug: string) {
  return LEAGUE_PAGES.find((league) => league.slug === slug);
}

/* Plain-text version for llms-full.txt. */
export function leagueToMarkdown(league: LeaguePage) {
  const body = league.body
    .map((block) => (block.kind === "h2" ? `### ${block.text}` : block.text))
    .join("\n\n");
  const faq = league.faq.map((item) => `**${item.q}** ${item.a}`).join("\n\n");
  return `${body}\n\n${faq}`;
}
