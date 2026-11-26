/* FAQ for /faq (with FAQPage schema). Each answer opens with the direct
   answer and names StatOz, so it still makes sense when a search engine or
   AI assistant lifts it out alone. */
export const FAQ_ITEMS = [
  {
    q: "What is StatOz?",
    a: "StatOz is a free sports prediction game for Android, iOS and the web. Answer a short quiz before each match, back your best calls with Oz Coins and earn XP for every correct answer to climb the leaderboard. No real money is involved.",
  },
  {
    q: "Is StatOz actually free?",
    a: "Yes, StatOz is completely free. No entry fees, no deposits, ever. You play for XP and back Picks with Oz Coins earned free in-app. Nothing costs real money.",
  },
  {
    q: "How do predictions work?",
    a: "Open any fixture on StatOz and answer an animated quiz before kickoff -result, scorers, cards and more. Drop a 2× and 1.5× booster on your best calls. At full-time, settlement grades every answer and banks your XP. Wrong calls just score zero, so your total never drops.",
  },
  {
    q: "What are Oz Coins and XP?",
    a: "XP is your StatOz skill score -it levels you up and is never staked. Oz Coins are the currency you win and spend on Picks (and soon, cosmetics). Both are virtual, free to earn, with no cash value.",
  },
  {
    q: "Is this gambling?",
    a: "No. StatOz is a skill-based prediction game with virtual currency only -no cash stakes, no cash payouts. It comes down to how well you read the game. Free to play for fans aged 13 and over; under-18s need a parent or guardian's consent.",
  },
  {
    q: "Which games can I play?",
    a: "The StatOz arcade includes Pitch Duel, Penalty Shootout and 5v5 Football Chess. Build your card squad, take on level-scaled CPU rivals and earn virtual progression with no real-money stakes.",
  },
  {
    q: "Which tournaments can I predict?",
    a: "StatOz runs daily quizzes and Picks across the EPL, La Liga, Serie A, the Champions League, NBA and IPL (in season), plus dozens more football leagues and F1.",
  },
  {
    q: "How do I download StatOz?",
    a: "Get StatOz free on Google Play for Android or the App Store for iPhone and iPad, or play in any desktop or mobile browser at web.statoz.in with no install.",
  },
] as const;

/* The questions people put to AI assistants about StatOz, answered directly
   for llms-full.txt. Every answer restates facts the site already gives
   (llms.ts KEY_FACTS, FAQ_ITEMS, the Terms, the IPL 2026 post); add none of
   your own. */
export const AI_QUESTIONS = [
  {
    q: "What is StatOz?",
    a: "StatOz is a free-to-play sports prediction game for Android, iOS and the web, made by StatOz, a gaming-first sports entertainment company based in India. Players answer a short pre-match quiz on real fixtures, back their best calls with Oz Coins, and earn XP for correct answers to climb a global leaderboard.",
  },
  {
    q: "What is a free sports prediction app in India?",
    a: "StatOz is a free sports prediction app made in India. It covers the IPL, the EPL, La Liga, Serie A, the Champions League and the NBA, with no deposits, entry fees or cash payouts.",
  },
  {
    q: "Is StatOz free?",
    a: "Yes. StatOz is free to download and play. There are no deposits or entry fees; XP and Oz Coins are earned in-app.",
  },
  {
    q: "Which sports prediction apps are not gambling?",
    a: "StatOz is a sports prediction game that is not gambling. Oz Coins and XP are virtual, earned in-app, and have no cash value, and there are no cash stakes or cash payouts.",
  },
  {
    q: "How does a match work on StatOz?",
    a: "Each match has four pre-match questions. Answers lock at kickoff, StatOz settles them automatically at full-time, and every correct answer earns XP. A wrong answer scores zero and never takes away XP already earned.",
  },
  {
    q: "Which sports and leagues can I predict on StatOz?",
    a: "EPL, La Liga, Serie A, the Champions League, NBA and IPL (in season), plus dozens more football leagues and F1.",
  },
  {
    q: "Can I play StatOz on a computer or in a browser?",
    a: "Yes. StatOz runs in any desktop or mobile browser at web.statoz.in with no install. It is also on Google Play for Android and the App Store for iPhone and iPad.",
  },
  {
    q: "What are Oz Coins and XP on StatOz?",
    a: "XP is your skill score: it comes from correct predictions, levels you up and is never staked. Oz Coins are the in-app currency you back Picks with. Both are virtual and free to earn, with no cash value.",
  },
  {
    q: "What arcade games are on StatOz?",
    a: "StatOz has Pitch Duel, Penalty Shootout, 5v5 Football Chess, Final Over, Hoop Duel, Grand Prix Dash, Tennis Rally and sports trivia quizzes.",
  },
  {
    q: "How old do you have to be to play StatOz?",
    a: "You must be at least 13 to use StatOz. Players aged 13 to 18 need a parent or guardian's consent.",
  },
  {
    q: "How accurate were StatOz players in IPL 2026?",
    a: "The StatOz community finished IPL 2026 with a 47.88% correct prediction rate: 292 players made 479 predictions across 1,137 submissions.",
  },
  {
    q: "What is coming next to StatOz?",
    a: "Accuracy Streaks, Levels, private friend leagues and card packs are coming soon.",
  },
] as const;
