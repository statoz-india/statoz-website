/* ============================================================
   StatOz -site data
   Mirrors the real app: Prediction Quiz, Picks, Leaderboard,
   XP / Oz Coins / arcade Games / Shop. Streaks + Levels soon.
   ============================================================ */

export type Rarity = "platinum" | "gold" | "silver" | "bronze";

export interface Player {
  id: string;
  n: string;
  nat: string;
  r: number;
  pos: string;
  rarity: Rarity;
  cat: string[];
  s: number[];
}

export const STAT_KEYS = ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"] as const;

/* Card pool -real app portraits, app rarity tiers (Platinum 90+, Gold 86-89,
   Silver 80-85, Bronze <80). "icon" = platinum, surfaced as the 90+ filter. */
export const PLAYERS: Player[] = [
  {
    id: "messi",
    n: "L. MESSI",
    nat: "ARGENTINA · #10",
    r: 93,
    pos: "RW",
    rarity: "platinum",
    cat: ["att", "icon"],
    s: [80, 92, 91, 94, 33, 65],
  },
  {
    id: "mbappe",
    n: "MBAPPÉ",
    nat: "FRANCE · #10",
    r: 91,
    pos: "ST",
    rarity: "platinum",
    cat: ["att", "icon"],
    s: [97, 90, 80, 92, 36, 78],
  },
  {
    id: "haaland",
    n: "HAALAND",
    nat: "NORWAY · #9",
    r: 91,
    pos: "ST",
    rarity: "platinum",
    cat: ["att", "icon"],
    s: [89, 93, 66, 80, 45, 88],
  },
  {
    id: "debruyne",
    n: "DE BRUYNE",
    nat: "BELGIUM · #7",
    r: 91,
    pos: "CM",
    rarity: "platinum",
    cat: ["mid", "icon"],
    s: [74, 88, 93, 87, 64, 78],
  },
  {
    id: "ronaldo",
    n: "RONALDO",
    nat: "PORTUGAL · #7",
    r: 90,
    pos: "ST",
    rarity: "platinum",
    cat: ["att", "icon"],
    s: [84, 93, 82, 85, 35, 77],
  },
  {
    id: "bellingham",
    n: "BELLINGHAM",
    nat: "ENGLAND · #10",
    r: 90,
    pos: "CAM",
    rarity: "platinum",
    cat: ["mid", "icon"],
    s: [80, 85, 86, 88, 78, 82],
  },
  {
    id: "kane",
    n: "H. KANE",
    nat: "ENGLAND · #9",
    r: 90,
    pos: "ST",
    rarity: "platinum",
    cat: ["att", "icon"],
    s: [70, 93, 84, 83, 49, 83],
  },
  {
    id: "vandijk",
    n: "VAN DIJK",
    nat: "NETHERLANDS · #4",
    r: 90,
    pos: "CB",
    rarity: "platinum",
    cat: ["def", "icon"],
    s: [76, 60, 71, 72, 90, 86],
  },
  {
    id: "rodri",
    n: "RODRI",
    nat: "SPAIN · #16",
    r: 89,
    pos: "CDM",
    rarity: "gold",
    cat: ["mid"],
    s: [62, 75, 86, 80, 86, 84],
  },
  {
    id: "neymar",
    n: "NEYMAR",
    nat: "BRAZIL · #10",
    r: 89,
    pos: "LW",
    rarity: "gold",
    cat: ["att"],
    s: [89, 83, 86, 93, 37, 63],
  },
  {
    id: "salah",
    n: "M. SALAH",
    nat: "EGYPT · #10",
    r: 89,
    pos: "RW",
    rarity: "gold",
    cat: ["att"],
    s: [90, 87, 81, 88, 45, 75],
  },
  {
    id: "lautaro",
    n: "LAUTARO",
    nat: "ARGENTINA · #22",
    r: 89,
    pos: "ST",
    rarity: "gold",
    cat: ["att"],
    s: [84, 89, 79, 84, 42, 83],
  },
  {
    id: "wirtz",
    n: "WIRTZ",
    nat: "GERMANY · #10",
    r: 88,
    pos: "CAM",
    rarity: "gold",
    cat: ["mid"],
    s: [80, 82, 86, 89, 52, 60],
  },
  {
    id: "foden",
    n: "FODEN",
    nat: "ENGLAND · #47",
    r: 88,
    pos: "CAM",
    rarity: "gold",
    cat: ["mid"],
    s: [83, 82, 85, 89, 55, 62],
  },
  {
    id: "yamal",
    n: "YAMAL",
    nat: "SPAIN · #19",
    r: 87,
    pos: "RW",
    rarity: "gold",
    cat: ["att"],
    s: [90, 80, 82, 90, 32, 64],
  },
  {
    id: "son",
    n: "SON",
    nat: "KOREA REP · #7",
    r: 87,
    pos: "LW",
    rarity: "gold",
    cat: ["att"],
    s: [88, 87, 80, 86, 42, 69],
  },
  {
    id: "saka",
    n: "SAKA",
    nat: "ENGLAND · #7",
    r: 87,
    pos: "RW",
    rarity: "gold",
    cat: ["att"],
    s: [86, 80, 81, 87, 45, 66],
  },
  {
    id: "modric",
    n: "MODRIĆ",
    nat: "CROATIA · #10",
    r: 87,
    pos: "CM",
    rarity: "gold",
    cat: ["mid"],
    s: [72, 76, 88, 87, 72, 66],
  },
  {
    id: "odegaard",
    n: "ØDEGAARD",
    nat: "NORWAY · #8",
    r: 87,
    pos: "CAM",
    rarity: "gold",
    cat: ["mid"],
    s: [77, 82, 87, 88, 55, 60],
  },
  {
    id: "musiala",
    n: "MUSIALA",
    nat: "GERMANY · #14",
    r: 86,
    pos: "CAM",
    rarity: "gold",
    cat: ["mid"],
    s: [85, 80, 80, 91, 40, 67],
  },
  {
    id: "pedri",
    n: "PEDRI",
    nat: "SPAIN · #8",
    r: 86,
    pos: "CM",
    rarity: "gold",
    cat: ["mid"],
    s: [78, 75, 86, 88, 60, 62],
  },
  {
    id: "gyokeres",
    n: "GYÖKERES",
    nat: "SWEDEN · #9",
    r: 86,
    pos: "ST",
    rarity: "gold",
    cat: ["att"],
    s: [88, 87, 72, 80, 40, 86],
  },
  {
    id: "raphinha",
    n: "RAPHINHA",
    nat: "BRAZIL · #11",
    r: 86,
    pos: "LW",
    rarity: "gold",
    cat: ["att"],
    s: [88, 82, 80, 87, 42, 66],
  },
  {
    id: "olmo",
    n: "OLMO",
    nat: "SPAIN · #20",
    r: 85,
    pos: "CAM",
    rarity: "silver",
    cat: ["mid"],
    s: [80, 80, 85, 86, 55, 62],
  },
];

export const RARITY_LEGEND: {
  name: string;
  range: string;
  drop: string;
  rarity: Rarity;
}[] = [
  { name: "Platinum", range: "90+ OVR", drop: "1%", rarity: "platinum" },
  { name: "Gold", range: "86–89 OVR", drop: "4%", rarity: "gold" },
  { name: "Silver", range: "80–85 OVR", drop: "35%", rarity: "silver" },
  { name: "Bronze", range: "below 80", drop: "55%", rarity: "bronze" },
];

/* ---------- Prediction Quiz steps ---------- */
export interface QuizStep {
  no: string;
  icon: string;
  h: string;
  p: string;
}

export const QUIZ_STEPS: QuizStep[] = [
  {
    no: "01",
    icon: "M3 5h18v2H3Zm0 6h18v2H3Zm0 6h12v2H3Z",
    h: "Pick a fixture",
    p: "Browse fixtures by league -EPL, La Liga, UCL, NBA, IPL. Tap one to open its quiz.",
  },
  {
    no: "02",
    icon: "M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4Z",
    h: "Answer pre Game",
    p: "Call scores, first scorer and key events through animated questions. Edit freely until kickoff.",
  },
  {
    no: "03",
    icon: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 4 1.6 4.4H18l-3.6 2.6L15.8 18 12 15.3 8.2 18l1.4-5L6 10.4h4.4Z",
    h: "Settlement reveal",
    p: "At full-time a cinematic flips every answer, shows the crowd vote and banks your boosted XP.",
  },
];

/* ---------- Picks markets ---------- */
export interface PickMarket {
  league: string;
  type: "Match" | "Event" | "Futures";
  q: string;
  close: string;
  vol: string;
  outs: { label: string; price: string }[];
}

export const PICK_MARKETS: PickMarket[] = [
  {
    league: "EPL",
    type: "Match",
    q: "Man City vs Arsenal -full-time result",
    close: "Closes Sat · 22:30",
    vol: "12.4K Oz",
    outs: [
      { label: "City", price: "1.85" },
      { label: "Draw", price: "3.40" },
      { label: "Arsenal", price: "2.10" },
    ],
  },
  {
    league: "EPL",
    type: "Event",
    q: "Haaland to score anytime?",
    close: "Closes Sat · 22:30",
    vol: "8.1K Oz",
    outs: [
      { label: "Yes", price: "1.45" },
      { label: "No", price: "2.60" },
    ],
  },
  {
    league: "LaLiga",
    type: "Event",
    q: "3 or more goals in Barcelona vs Real Madrid?",
    close: "Closes Sun · 20:45",
    vol: "6.3K Oz",
    outs: [
      { label: "Yes", price: "1.70" },
      { label: "No", price: "2.15" },
    ],
  },
  {
    league: "UCL",
    type: "Futures",
    q: "Champions League 2026/27 -winner",
    close: "Closes Jan 27",
    vol: "4.2K Oz",
    outs: [
      { label: "Bayern", price: "4.0" },
      { label: "Barcelona", price: "5.5" },
      { label: "Liverpool", price: "7.0" },
      { label: "Arsenal", price: "8.0" },
    ],
  },
];

export const PICK_FILTERS = [
  "All",
  "EPL",
  "UCL",
  "LaLiga",
  "Serie A",
  "NBA",
  "IPL",
] as const;
export const PICK_TYPES = ["All Picks", "Matches", "Event", "Futures"] as const;

/* ---------- Picks steps ---------- */
export const PICK_STEPS: QuizStep[] = [
  {
    no: "01",
    icon: "M4 13h3v7H4Zm6.5-6h3v13h-3ZM17 3h3v17h-3Z",
    h: "Pick a market",
    p: "Browse match, event and futures markets across sports. Tap any line to open its prices.",
  },
  {
    no: "02",
    icon: "M12 3C7.6 3 4 4.3 4 6s3.6 3 8 3 8-1.3 8-3-3.6-3-8-3Zm8 5.5c0 1.7-3.6 3-8 3s-8-1.3-8-3V11c0 1.7 3.6 3 8 3s8-1.3 8-3Zm0 4.5c0 1.7-3.6 3-8 3s-8-1.3-8-3v2.5c0 1.7 3.6 3 8 3s8-1.3 8-3Z",
    h: "Stake Oz Coins",
    p: "Read the price, choose an outcome and stake your Oz Coins. Adjust freely until the market closes.",
  },
  {
    no: "03",
    icon: "M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5Zm-1.2 13.2L7 11.4l1.4-1.4 2.4 2.4 4.4-4.4L16.6 9Z",
    h: "Settle & collect",
    p: "When the market resolves, winning picks pay out at your locked price -straight to your balance.",
  },
];

/* ---------- Accuracy streak tiers ---------- */
export interface StreakTier {
  name: string;
  at: string;
  mult: string;
  desc: string;
  cls: string;
}

export const STREAK_TIERS: StreakTier[] = [
  {
    name: "WARM",
    at: "3+",
    mult: "1.10×",
    desc: "Three correct in a row. The board takes notice.",
    cls: "warm",
  },
  {
    name: "HOT",
    at: "5+",
    mult: "1.25×",
    desc: "Five straight. Every call carries real weight.",
    cls: "hot",
  },
  {
    name: "BLAZING",
    at: "10+",
    mult: "1.50×",
    desc: "Double digits. Reading matches before they happen.",
    cls: "blazing",
  },
  {
    name: "INFERNO",
    at: "20+",
    mult: "2.00×",
    desc: "Twenty unbroken. Untouchable form.",
    cls: "inferno",
  },
];

/* ---------- Leaderboard ---------- */
export type Move = "up" | "down" | "hold" | "new";
export interface LbRow {
  tag: string;
  loc: string;
  av: string;
  val: string;
  mv: Move;
  by?: number;
}
export interface LbBoard {
  key: string;
  label: string;
  unit: string;
  tag: string;
  live?: boolean;
  rows: LbRow[];
  you: LbRow & { rank: string };
}

export const BOARDS: LbBoard[] = [
  {
    key: "matchday",
    label: "Match Day",
    unit: "XP",
    tag: "// XP THIS MATCH DAY",
    live: true,
    rows: [
      {
        tag: "NEON_STRIKER",
        loc: "IN · Mumbai",
        av: "rodri",
        val: "4,820",
        mv: "up",
        by: 2,
      },
      {
        tag: "xG_WIZARD",
        loc: "IN · Bengaluru",
        av: "bellingham",
        val: "4,610",
        mv: "up",
        by: 1,
      },
      {
        tag: "THE_GAFFER",
        loc: "IN · Delhi",
        av: "camavinga",
        val: "4,470",
        mv: "down",
        by: 1,
      },
      {
        tag: "tiki_taka_99",
        loc: "IN · Pune",
        av: "adams",
        val: "4,120",
        mv: "hold",
      },
      {
        tag: "poacher_07",
        loc: "IN · Kolkata",
        av: "ndiaye",
        val: "3,990",
        mv: "up",
        by: 3,
      },
      {
        tag: "var_check",
        loc: "IN · Chennai",
        av: "raphinha",
        val: "3,840",
        mv: "new",
      },
    ],
    you: {
      rank: "142",
      tag: "YOU",
      loc: "Climb 6 spots into the top 100",
      av: "rodri",
      val: "2,310",
      mv: "up",
      by: 18,
    },
  },
  {
    key: "tourney",
    label: "Tourney",
    unit: "PTS",
    tag: "// SEASON TOURNAMENT",
    rows: [
      {
        tag: "THE_GAFFER",
        loc: "IN · Delhi",
        av: "camavinga",
        val: "18,940",
        mv: "up",
        by: 1,
      },
      {
        tag: "NEON_STRIKER",
        loc: "IN · Mumbai",
        av: "rodri",
        val: "18,220",
        mv: "down",
        by: 1,
      },
      {
        tag: "set_piece_sam",
        loc: "IN · Hyderabad",
        av: "adams",
        val: "17,510",
        mv: "hold",
      },
      {
        tag: "xG_WIZARD",
        loc: "IN · Bengaluru",
        av: "bellingham",
        val: "16,980",
        mv: "up",
        by: 4,
      },
      {
        tag: "low_block_lo",
        loc: "IN · Jaipur",
        av: "ndiaye",
        val: "16,330",
        mv: "down",
        by: 2,
      },
      {
        tag: "false_nine",
        loc: "IN · Kochi",
        av: "raphinha",
        val: "15,870",
        mv: "up",
        by: 1,
      },
    ],
    you: {
      rank: "88",
      tag: "YOU",
      loc: "Top 100 -defend your seed",
      av: "rodri",
      val: "9,640",
      mv: "up",
      by: 5,
    },
  },
  {
    key: "coins",
    label: "Coins",
    unit: "OZ",
    tag: "// OZ COIN HOLDERS",
    rows: [
      {
        tag: "coin_baron",
        loc: "IN · Mumbai",
        av: "adams",
        val: "184,200",
        mv: "hold",
      },
      {
        tag: "the_vault",
        loc: "IN · Delhi",
        av: "bellingham",
        val: "171,050",
        mv: "up",
        by: 2,
      },
      {
        tag: "NEON_STRIKER",
        loc: "IN · Mumbai",
        av: "rodri",
        val: "166,800",
        mv: "up",
        by: 1,
      },
      {
        tag: "value_hunter",
        loc: "IN · Pune",
        av: "camavinga",
        val: "158,400",
        mv: "down",
        by: 2,
      },
      {
        tag: "parlay_pat",
        loc: "IN · Kolkata",
        av: "ndiaye",
        val: "149,900",
        mv: "hold",
      },
      {
        tag: "edge_eddie",
        loc: "IN · Chennai",
        av: "raphinha",
        val: "141,260",
        mv: "new",
      },
    ],
    you: {
      rank: "640",
      tag: "YOU",
      loc: "Win Picks to grow your balance",
      av: "rodri",
      val: "12,480",
      mv: "up",
      by: 31,
    },
  },
  {
    key: "games",
    label: "Games",
    unit: "WINS",
    tag: "// GAME-MODE WINS",
    rows: [
      {
        tag: "duel_king",
        loc: "IN · Bengaluru",
        av: "bellingham",
        val: "312",
        mv: "hold",
      },
      {
        tag: "shot_meter",
        loc: "IN · Mumbai",
        av: "rodri",
        val: "287",
        mv: "up",
        by: 1,
      },
      {
        tag: "penalty_god",
        loc: "IN · Delhi",
        av: "adams",
        val: "264",
        mv: "up",
        by: 3,
      },
      {
        tag: "deck_doctor",
        loc: "IN · Pune",
        av: "camavinga",
        val: "241",
        mv: "down",
        by: 2,
      },
      {
        tag: "counter_atk",
        loc: "IN · Jaipur",
        av: "ndiaye",
        val: "228",
        mv: "hold",
      },
      {
        tag: "clean_sheet",
        loc: "IN · Kochi",
        av: "raphinha",
        val: "210",
        mv: "up",
        by: 1,
      },
    ],
    you: {
      rank: "—",
      tag: "YOU",
      loc: "Win a game-mode match to get on the board",
      av: "rodri",
      val: "0",
      mv: "new",
    },
  },
];

export const LB_SPORTS = ["EPL", "UCL", "LaLiga", "NBA", "IPL"] as const;

/* ---------- Features bento ---------- */
export interface FeatureCell {
  cls?: string;
  icon: string;
  h: string;
  p: string;
  meta?: [string, string];
  live?: boolean;
}

export const FEATURES: FeatureCell[] = [
  {
    cls: "bento__cell--lg",
    icon: "M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4Z",
    h: "Prediction Quiz",
    p: "An animated quiz on every fixture -scores, scorers, cards, corners -settled by a cinematic that banks your XP.",
    meta: ["XP only", "never coins"],
    live: true,
  },
  {
    icon: "M6.2 17.8 5 16.6l5-5 5 5-1.2 1.2L10 14l-3.8 3.8Zm0-5L5 11.6l5-5 5 5-1.2 1.2L10 9l-3.8 3.8Z",
    h: "Picks markets",
    p: "Back match, event and futures markets with Oz Coins. Read the odds, stake, lock it in.",
    live: true,
  },
  {
    icon: "M13 2 3 14h7l-1 8 10-12h-7Z",
    h: "Accuracy Streaks",
    p: "Coming soon: stack correct calls Warm → Inferno to multiply your XP up to 2×.",
  },
  {
    cls: "bento__cell--wide",
    icon: "M5 4h14v3a4 4 0 0 1-3 3.9A4 4 0 0 1 13 14v2h3v3H8v-3h3v-2a4 4 0 0 1-3-3.1A4 4 0 0 1 5 7Z",
    h: "Global Leaderboards",
    p: "Match Day, Tourney, Coins and Games boards -live movement, your rank always pinned.",
    meta: ["4 board types", "weekly resets"],
    live: true,
  },
  {
    cls: "bento__cell--wide",
    icon: "M5 4h14v3a4 4 0 0 1-3 3.9A4 4 0 0 1 13 14v2h3v3H8v-3h3v-2a4 4 0 0 1-3-3.1A4 4 0 0 1 5 7Z",
    h: "Challenge Friends",
    p: "Coming soon: spin up a private league and settle who reads the game best.",
  },
  {
    icon: "M3 13h2l2-5 3 9 3-12 3 9 2-4h3",
    h: "XP",
    p: "One honest number. Every correct read earns XP; a miss never takes it away. Levels are coming soon.",
    live: true,
  },
  {
    icon: "M20 7h-3.1A3 3 0 0 0 12 3.2 3 3 0 0 0 7.1 7H4v4h16Zm-9 0a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm3 0a1 1 0 1 1 1-1 1 1 0 0 1-1 1ZM4 13v6a2 2 0 0 0 2 2h5v-8Zm9 8h5a2 2 0 0 0 2-2v-6h-7Z",
    h: "Daily Card Drop",
    p: "A free card every 24 hours to build your Pitch Duel deck.",
    live: true,
  },
];

/* ---------- Games (live in the app) ---------- */
export interface GameTeaser {
  name: string;
  tag: string;
  desc: string;
  bg?: string;
  meta: string[];
}

export const GAMES: GameTeaser[] = [
  {
    name: "Pitch Duel",
    tag: "Tactical Card Game",
    desc: "Draft an 11-card deck and out-think a rival over four tactical rounds, with penalties to settle a draw.",
    bg: "/assets/bg/match_stadium.png",
    meta: ["11-card deck", "4 rounds + pens"],
  },
  {
    name: "Penalty Shootout",
    tag: "Nerves & Timing",
    desc: "You versus the keeper. Read the dive, pick your corner, hold your nerve.",
    bg: "/assets/bg/penalty_arena.png",
    meta: ["Best of 5", "sudden death"],
  },
  {
    name: "5v5 Football Chess",
    tag: "Tactical Squad Duel",
    desc: "Pick a five-player squad and out-think a rival move by move.",
    meta: ["5v5", "turn-based"],
  },
  {
    name: "Final Over",
    tag: "Cricket Chase",
    desc: "Six balls, one target. Chase it down in the last over.",
    meta: ["6 balls", "cricket"],
  },
  {
    name: "Hoop Duel",
    tag: "Arcade Hoops",
    desc: "Street one-on-one basketball. Beat your rival to the score.",
    meta: ["1-on-1", "basketball"],
  },
  {
    name: "Grand Prix Dash",
    tag: "Arcade Racer",
    desc: "One flat-out lap. Hit your lines and beat the clock.",
    meta: ["1 lap", "racing"],
  },
  {
    name: "Tennis Rally",
    tag: "Arcade Tennis",
    desc: "Keep the rally alive across 20 arcade sets and 5 modes.",
    meta: ["20 sets", "5 modes"],
  },
];

/* ---------- Shop (avatars + banners live, packs soon) ---------- */
export interface ShopGroup {
  h: string;
  tag: string;
  soon?: boolean;
  items: { name: string; img: string; sub: string }[];
}

export const SHOP_GROUPS: ShopGroup[] = [
  {
    h: "Card Packs",
    tag: "// PACKS · SOON",
    soon: true,
    items: [
      {
        name: "Bronze Pack",
        img: "/assets/packs/bronze.png",
        sub: "Everyday pulls",
      },
      {
        name: "Silver Pack",
        img: "/assets/packs/silver.png",
        sub: "Better odds",
      },
      { name: "Gold Pack", img: "/assets/packs/gold.png", sub: "86–89 chance" },
      {
        name: "Platinum Pack",
        img: "/assets/packs/platinum.png",
        sub: "90+ chance",
      },
    ],
  },
  {
    h: "Avatars",
    tag: "// IDENTITY",
    items: [
      {
        name: "Rodri",
        img: "/assets/avatars/rodri.webp",
        sub: "Profile avatar",
      },
      {
        name: "Bellingham",
        img: "/assets/avatars/bellingham.webp",
        sub: "Profile avatar",
      },
      {
        name: "Camavinga",
        img: "/assets/avatars/camavinga.webp",
        sub: "Profile avatar",
      },
      {
        name: "Adams",
        img: "/assets/avatars/adams.webp",
        sub: "Profile avatar",
      },
    ],
  },
];

export const SHOP_BANNERS = [
  "/assets/bg/profile_banner.png",
  "/assets/bg/profile_banner_green_red.png",
  "/assets/bg/profile_banner_korea.png",
];
