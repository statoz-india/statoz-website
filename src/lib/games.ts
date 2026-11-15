import { ROUTES } from "@/lib/routes";

export type GameSlug =
  | "pitch-duel"
  | "penalty-shootout"
  | "football-chess";

export type GameTheme = "duel" | "shootout" | "chess";

export interface GameStat {
  label: string;
  value: string;
}

export interface GameContentBlock {
  title: string;
  description: string;
}

export interface GameFlowStep extends GameContentBlock {
  number: string;
}

export interface GameDetail {
  slug: GameSlug;
  href: string;
  name: string;
  heroLead: string;
  heroAccent: string;
  kicker: string;
  tag: string;
  teaser: string;
  homeMeta: string[];
  theme: GameTheme;
  background: string;
  seo: {
    title: string;
    description: string;
  };
  stats: GameStat[];
  expectations: GameContentBlock[];
  flow: GameFlowStep[];
  mechanics: GameContentBlock[];
  reward: {
    eyebrow: string;
    title: string;
    description: string;
    points: string[];
  };
}

export const GAMES: GameDetail[] = [
  {
    slug: "pitch-duel",
    href: ROUTES.pitchDuel,
    name: "Pitch Duel",
    heroLead: "Build your deck.",
    heroAccent: "Own the moment.",
    kicker: "// Tactical football card game",
    tag: "Tactical Card Game",
    teaser:
      "Turn your collection into an 11-card squad, read four football scenarios and strike when the moment is right.",
    homeMeta: ["11-card deck", "4 rounds + pens"],
    theme: "duel",
    background: "/statoz-website/assets/bg/match_stadium.png",
    seo: {
      title: "Pitch Duel Football Card Game",
      description:
        "Build an 11-card football squad, make tactical choices across four rounds and master the Shot Meter in StatOz Pitch Duel.",
    },
    stats: [
      { value: "11", label: "Cards in your deck" },
      { value: "4", label: "Tactical rounds" },
      { value: "2 + 2", label: "Attack and defence turns" },
      { value: "PENS", label: "Tiebreaker" },
    ],
    expectations: [
      {
        title: "Your collection becomes the squad",
        description:
          "Bring two attackers, two defenders, a goalkeeper and six action cards into every match. Better cards help, but the right choice matters just as much.",
      },
      {
        title: "Every round tells a football story",
        description:
          "Counter attacks, set pieces and box battles change the balance of each round. Read the scenario before committing your player and action.",
      },
      {
        title: "Timing gives you the final say",
        description:
          "Stop the Shot Meter in the strongest zone to add a power surge. A perfect strike can turn a close tactical call into the decisive moment.",
      },
    ],
    flow: [
      {
        number: "01",
        title: "Build a legal deck",
        description:
          "Choose five player cards and six attack, defence or special actions from the cards you own.",
      },
      {
        number: "02",
        title: "Read your role",
        description:
          "The coin toss sets the opening role, then you alternate between attacking and defending across four rounds.",
      },
      {
        number: "03",
        title: "Pick the combination",
        description:
          "Match a role-ready player with an action card that fits the scenario, its bonuses and its risk.",
      },
      {
        number: "04",
        title: "Strike and settle",
        description:
          "Time the meter, reveal both sides and chase the winning score. A draw goes to penalties.",
      },
    ],
    mechanics: [
      {
        title: "Attack and defend",
        description:
          "You play both sides of the match, so a balanced deck is just as important as a headline attacker.",
      },
      {
        title: "Visible goal chances",
        description:
          "The Shot Meter shows your real goal or stop chance before you strike, keeping every decision readable.",
      },
      {
        title: "Risky cards, bigger drama",
        description:
          "High-impact actions can create fouls or red cards. The strongest option is not always the safest one.",
      },
      {
        title: "A rival at your level",
        description:
          "CPU squads and decision-making scale with your progress so the next matchup keeps asking more of your deck.",
      },
    ],
    reward: {
      eyebrow: "// Collection meets progression",
      title: "Every match feeds the wider StatOz journey",
      description:
        "Pitch Duel connects your cards, match history and progression. Results can earn XP and Oz Coins, while stronger collections open more ways to shape your deck.",
      points: ["XP and Oz Coin rewards", "Saved match history", "Level-scaled opponents"],
    },
  },
  {
    slug: "penalty-shootout",
    href: ROUTES.penaltyShootout,
    name: "Penalty Shootout",
    heroLead: "Pick a corner.",
    heroAccent: "Hold your nerve.",
    kicker: "// Standalone spot-kick mode",
    tag: "Sudden Death",
    teaser:
      "Trade spot kicks with a level-matched rival, read the patterns and survive sudden death when five kicks are not enough.",
    homeMeta: ["Best of 5", "No draws"],
    theme: "shootout",
    background: "/statoz-website/assets/bg/penalty_arena.png",
    seo: {
      title: "Penalty Shootout Football Game",
      description:
        "Take five pressure penalties, choose left, centre or right and survive sudden death in the free StatOz Penalty Shootout game.",
    },
    stats: [
      { value: "5", label: "Regulation kicks each" },
      { value: "3", label: "Shot and dive directions" },
      { value: "95%", label: "Chance when keeper goes wrong" },
      { value: "0", label: "Draws" },
    ],
    expectations: [
      {
        title: "Your active squad takes the kicks",
        description:
          "Two attackers, two defenders and your goalkeeper form the five-player order. Ratings still matter when shooter meets keeper.",
      },
      {
        title: "Direction is the central mind game",
        description:
          "Choose left, centre or right when shooting, then switch roles and decide where your keeper should dive.",
      },
      {
        title: "Patterns become pressure",
        description:
          "The rival can learn from repeated choices as your level rises. Stay unpredictable when the shootout reaches its biggest moments.",
      },
    ],
    flow: [
      {
        number: "01",
        title: "Bring your five-player squad",
        description:
          "Enter with the active Pitch Duel squad and meet a CPU rival generated around your current level.",
      },
      {
        number: "02",
        title: "Choose the shot",
        description:
          "Aim left, centre or right. A wrong-way dive is usually a goal; a correct read brings ratings into the contest.",
      },
      {
        number: "03",
        title: "Become the keeper",
        description:
          "Read the opponent and commit your dive while the kick history builds a visible trail of both players' choices.",
      },
      {
        number: "04",
        title: "Clinch it or face sudden death",
        description:
          "The contest ends early when the lead cannot be caught. A tie after five kicks each continues in decisive pairs.",
      },
    ],
    mechanics: [
      {
        title: "Fast sessions",
        description:
          "Jump from the lobby to the lineup and into the kick loop without playing a full four-round card match.",
      },
      {
        title: "Ratings still count",
        description:
          "When the keeper guesses correctly, the shooter-versus-keeper rating gap changes the chance of scoring.",
      },
      {
        title: "Early-out drama",
        description:
          "A dominant lead can finish the shootout before all ten kicks, just like a real penalty contest.",
      },
      {
        title: "A complete kick log",
        description:
          "Review every direction, goal, save, shooter and keeper when the final result is decided.",
      },
    ],
    reward: {
      eyebrow: "// Quick match, real progress",
      title: "Win the duel and bank the result",
      description:
        "Shootouts award smaller, fast-session rewards while still connecting to your StatOz level, wallet, streaks and match history.",
      points: ["XP for shootout wins", "Oz Coins after every result", "Dedicated shootout history"],
    },
  },
  {
    slug: "football-chess",
    href: ROUTES.footballChess,
    name: "5v5 Football Chess",
    heroLead: "See the space.",
    heroAccent: "Control the board.",
    kicker: "// Two-minute tactical squad duel",
    tag: "5v5 Tactical Duel",
    teaser:
      "Choose a formation, move one piece at a time and turn positioning, ratings and momentum into goals before full time.",
    homeMeta: ["3 x 4 board", "2-minute match"],
    theme: "chess",
    background: "/statoz-website/assets/bg/home_stadium.png",
    seo: {
      title: "5v5 Football Chess Tactical Game",
      description:
        "Choose a formation, control a 3x4 football board and out-think a level-matched rival in the two-minute StatOz Football Chess game.",
    },
    stats: [
      { value: "3 x 4", label: "Tactical board" },
      { value: "2 MIN", label: "Match clock" },
      { value: "10 SEC", label: "Decision timer" },
      { value: "4", label: "Starting formations" },
    ],
    expectations: [
      {
        title: "Formation starts the argument",
        description:
          "Set up in a Box, Diamond, High Line or Low Block. Your four outfielders take the grid while the keeper protects the goal.",
      },
      {
        title: "One action changes the board",
        description:
          "Move, pass, dribble, shoot, press, tackle or slide. Every turn reshapes the legal choices available to both sides.",
      },
      {
        title: "Ratings meet positioning",
        description:
          "Player quality influences duels and shots, but lanes, distance, nearby defenders and the goalkeeper decide how strong the chance becomes.",
      },
    ],
    flow: [
      {
        number: "01",
        title: "Choose your shape",
        description:
          "Pick one of four formations for the active squad's four outfield players and goalkeeper.",
      },
      {
        number: "02",
        title: "Meet a level-scaled rival",
        description:
          "Matchmaking reveals a CPU squad tuned near your level before the coin toss decides kickoff.",
      },
      {
        number: "03",
        title: "Take one action per turn",
        description:
          "Use contextual actions to create space, win possession and move the ball into a better shooting lane.",
      },
      {
        number: "04",
        title: "Score before full time",
        description:
          "Goals reset both formations and give kickoff to the conceding side. The final whistle lands after two minutes.",
      },
    ],
    mechanics: [
      {
        title: "Eight-way movement",
        description:
          "Adjacent diagonal cells count, opening compact passing lanes, pressure angles and ways around a defender.",
      },
      {
        title: "Contextual action bar",
        description:
          "The selected piece, possession and nearby players decide which moves are legal on every turn.",
      },
      {
        title: "Momentum boost",
        description:
          "Win duels and score to fill three momentum pips, then spend a full meter to improve a contested action.",
      },
      {
        title: "Tactical CPU",
        description:
          "As your level rises, the rival increasingly favours useful passes, pressure, tackles, dribbles and shots.",
      },
    ],
    reward: {
      eyebrow: "// Tactical wins, shared progression",
      title: "Turn board control into XP",
      description:
        "Football Chess is an XP-only mode. Wins, draws and losses feed the shared progression ledger, while local records track results and streaks.",
      points: ["XP after every result", "Win, draw and loss record", "Current and best streaks"],
    },
  },
];

export const GAME_BY_SLUG = Object.fromEntries(
  GAMES.map((game) => [game.slug, game]),
) as Record<GameSlug, GameDetail>;

export function getGame(slug: string): GameDetail | undefined {
  return GAME_BY_SLUG[slug as GameSlug];
}
