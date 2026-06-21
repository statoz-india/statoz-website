import { ROUTES } from "@/lib/routes";

export interface BlogStat {
  label: string;
  value: string;
}

export interface BlogPost {
  slug: string;
  href: string;
  eyebrow: string;
  title: string;
  summary: string;
  visual: {
    top: string;
    main: string;
    badge: string;
    variant: "season" | "quiz";
  };
  linkText: string;
  stats: BlogStat[];
}

export const IPL_JOURNEY_POST: BlogPost = {
  slug: "ipl-2026-prediction-journey",
  href: ROUTES.iplJourney,
  eyebrow: "IPL 2026 · Community Report",
  title: "Our IPL 2026 Prediction Journey",
  summary:
    "A look at how the StatOz community read the game, backed its instincts, and turned every IPL match into a shared prediction experience.",
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
};

export const PREDICTION_QUIZ_POST: BlogPost = {
  slug: "how-statoz-prediction-quiz-works",
  href: ROUTES.predictionQuizGuide,
  eyebrow: "Product Guide · How It Works",
  title: "How the StatOz Prediction Quiz Works",
  summary:
    "Four questions, one match, and a simple test of how well you read the game -from pre-match picks to automatic settlement and XP.",
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
};

export const BLOG_POSTS: BlogPost[] = [PREDICTION_QUIZ_POST, IPL_JOURNEY_POST];
