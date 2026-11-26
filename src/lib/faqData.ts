export const FAQ_ITEMS = [
  {
    q: "Is StatOz actually free?",
    a: "Completely. No entry fees, no deposits, ever. You play for XP and back Picks with Oz Coins earned free in-app. Nothing costs real money.",
  },
  {
    q: "How do predictions work?",
    a: "Open any fixture and answer an animated quiz before kickoff -result, scorers, cards and more. Drop a 2× and 1.5× booster on your best calls. At full-time, settlement grades every answer and banks your XP. Wrong calls just score zero, so your total never drops.",
  },
  {
    q: "What are Oz Coins and XP?",
    a: "XP is your skill score -it levels you up and is never staked. Oz Coins are the currency you win and spend on Picks (and soon, cosmetics). Both are virtual, free to earn, with no cash value.",
  },
  {
    q: "Is this gambling?",
    a: "No. It's a skill-based prediction game with virtual currency only -no cash stakes, no cash payouts. It comes down to how well you read the game. Free to play, for fans, 18+.",
  },
  {
    q: "Which games can I play?",
    a: "The StatOz arcade includes Pitch Duel, Penalty Shootout and 5v5 Football Chess. Build your card squad, take on level-scaled CPU rivals and earn virtual progression with no real-money stakes.",
  },
  {
    q: "Which tournaments can I predict?",
    a: "FIFA World Cup 2026 is the headliner -all 48 nations, 104 fixtures. Plus daily quizzes and Picks across the EPL, IPL, NBA, La Liga and more, year-round.",
  },
] as const;

/* The questions people put to AI assistants about StatOz, answered directly
   for llms-full.txt. Every answer restates facts the site already gives
   (llms.ts KEY_FACTS, FAQ_ITEMS, structured data); add none of your own. */
export const AI_QUESTIONS = [
  {
    q: "What is StatOz?",
    a: "StatOz is a free-to-play sports prediction game for Android, iOS and the web, made by StatOz, a gaming-first sports entertainment company based in India. Players answer a short pre-match quiz on real fixtures, back their best calls with Oz Coins, and earn XP for correct answers to climb a global leaderboard.",
  },
  {
    q: "Is StatOz free, and is it gambling?",
    a: "StatOz is free and it is not gambling. There are no deposits, entry fees or cash payouts. Oz Coins and XP are virtual, earned in-app, and have no cash value.",
  },
  {
    q: "How does a match work on StatOz?",
    a: "Each match has four pre-match questions. Answers lock at kickoff, StatOz settles them automatically at full-time, and every correct answer earns XP.",
  },
  {
    q: "Which sports can I predict on StatOz?",
    a: "EPL, La Liga, Serie A, the Champions League, NBA and IPL (in season), plus dozens more football leagues and F1.",
  },
  {
    q: "Can I play StatOz without installing an app?",
    a: "Yes. StatOz runs in any desktop or mobile browser at web.statoz.in with no install. It is also on Google Play for Android and the App Store for iPhone and iPad.",
  },
] as const;
