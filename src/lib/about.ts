/* About page copy. The page renders it and llms-full.txt prints it, so the
   company story reads the same to people and to AI models. */

export type AboutBlock = { p: string } | { h3: string } | { ul: string[] };

export interface AboutSection {
  id: string;
  title: string;
  blocks: AboutBlock[];
}

export const ABOUT_LEAD =
  "StatOz exists to make sports more fun, social, and immersive for fans. We are building a unified sports gaming platform where fandom feels alive before, during, and after every match.";

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    id: "who-we-are",
    title: "Who We Are",
    blocks: [
      {
        p: "StatOz is a gaming-first company for sports fans. Our goal is simple: create fun, social, and immersive sports experiences that bring fans together.",
      },
      {
        p: "We believe sports fandom should feel playable. StatOz turns the energy of matchdays into interactive games, prediction moments, progression, and community-driven competition.",
      },
    ],
  },
  {
    id: "not-gambling",
    title: "Not Gambling",
    blocks: [
      {
        p: "We are a games company, not a gambling platform. StatOz does not support staking, deposits, betting, cash-outs, or wagering with real money.",
      },
      { h3: "What this means" },
      {
        ul: [
          "No real money can be deposited, staked, won, or lost.",
          "No real-money prizes can be won on the platform.",
          "In-platform progression exists for gameplay, status, and entertainment only.",
          "StatOz is built around sports knowledge, prediction skill, fan identity, and social competition.",
        ],
      },
    ],
  },
  {
    id: "what-we-are-building",
    title: "What We Are Building",
    blocks: [
      {
        p: "We are building a unified platform for sports gaming: one place where fans can play around matches, test their sports knowledge, collect progress, follow their friends, and keep returning as the sports calendar evolves.",
      },
      {
        p: "Our long-term vision is to make sports gaming feel like a live service game. New matches, seasons, cards, game modes, quests, and social layers should keep the experience fresh and worth coming back to.",
      },
    ],
  },
  {
    id: "fan-experience",
    title: "Fan Experience",
    blocks: [
      {
        p: "StatOz is designed for the moments fans already care about: reading the game, backing an instinct, comparing picks, climbing leaderboards, and sharing the tension of a live result.",
      },
      { h3: "Built for sports communities" },
      {
        ul: [
          "Fun game loops around real sports moments.",
          "Social competition that gives every fan a reason to play.",
          "Immersive progression systems that reward participation and knowledge.",
          "A platform direction that can grow across sports, formats, and fan communities.",
        ],
      },
    ],
  },
  {
    id: "free-to-play-economy",
    title: "Free-To-Play Economy",
    blocks: [
      {
        p: "StatOz is free to play. Any coins, XP, ranks, cards, or other in-platform systems are virtual game mechanics created to make the experience more engaging.",
      },
      {
        p: "These systems do not represent money, financial products, payment instruments, or anything that can be redeemed for cash. They exist to support competition, expression, and progression inside the game.",
      },
    ],
  },
];

export function aboutToMarkdown() {
  return ABOUT_SECTIONS.map((section) => {
    const body = section.blocks
      .map((block) => {
        if ("h3" in block) return `#### ${block.h3}`;
        if ("ul" in block) return block.ul.map((item) => `- ${item}`).join("\n");
        return block.p;
      })
      .join("\n\n");
    return `### ${section.title}\n\n${body}`;
  }).join("\n\n");
}
