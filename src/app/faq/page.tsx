import FooterSection from "../revamped/footerSection/footer";
import HeaderSection from "../revamped/headerSection/header";
import { faqRow } from "../revamped/faqSection/faqs";

interface FAQPageProps {
  searchParams?: Promise<{
    layout?: string | string[];
  }>;
}

async function FAQPage({ searchParams }: FAQPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawLayout = resolvedSearchParams?.layout;
  const layoutParam = Array.isArray(rawLayout) ? rawLayout[0] : rawLayout;
  const showLayout = layoutParam?.toLowerCase() !== "false";

  return (
    <div className="flex flex-col">
      {showLayout && (
        <div className="bg-[linear-gradient(180deg,#000000_0%,#131D31_25%,#1D293D_50%,#131D31_75%,#000000_100%)]">
          <HeaderSection />
        </div>
      )}
      <div className="bg-[#F7F7F7] py-20 px-6">
        {faqRow({
          title: "What is StatOz?",
          arrowBackgroundColor: true,
          data: "Our platform is built to help players, teams, and digital athletes train, compete, and grow in a structured competitive esports environment.",
        })}
        {faqRow({
          title: "What features are included in the StatOz MVP?",
          data: `The current MVP includes:\n  • Match Prediction\n • Quiz Prediction\n • Market Leaderboard\nThese are the three live MVP features called out in the investor deck.`,
        })}
        {faqRow({
          title: "Is StatOz a betting or gambling app?",
          data: `No. StatOz is positioned as a pure-entertainment, non-gambling product. The prediction market is virtual only, with no real-money betting and no cash-out.`,
        })}
        {faqRow({
          title: "Can I withdraw my rewards as cash?",
          data: `No. StatOz rewards are virtual and cannot be withdrawn as real money.`,
        })}
        {faqRow({
          title: "Can users win real money on StatOz?",
          data: `No. StatOz does not allow real-money wagering or cash withdrawal. The platform is designed so users compete for virtual rewards, status, and leaderboard progression instead of cash winnings.`,
        })}
        {faqRow({
          title: "How do I play StatOz?",
          data: `Users pick an upcoming match, answer the match quiz before the game starts, make a prediction in the market, and then earn rewards based on participation and outcomes. Those rewards help them move up the leaderboard.`,
        })}
        {faqRow({
          title: "How does the match quiz work?",
          data: `The quiz is made up of multiple-choice questions about an upcoming match. Users can answer questions, track progress, submit before the match starts, and edit their submission until the match begins.`,
        })}
        {faqRow({
          title: "How does the free-to-play prediction market work?",
          data: `The prediction market lets users make virtual predictions on match outcomes. It is described as a Polymarket-style market, but it runs entirely on virtual gameplay mechanics. There is no real-money stake, and rewards stay inside the app.`,
        })}
        {faqRow({
          title: "What do users earn in the MVP?",
          data: `Users earn XP and Coins through core actions like quiz participation, correct prediction outcomes, and daily login streaks. XP helps with progression, while Coins are part of the in-app reward system.`,
        })}
        {faqRow({
          title: "What is the leaderboard for?",
          data: `The leaderboard ranks users based on their performance and progression. In the MVP, it includes global and friends rankings and shows things like XP, Coins, and level badges.`,
        })}
        {faqRow({
          title: "Why is StatOz free-to-play?",
          data: `StatOz is designed to reward sports knowledge without making users risk money. The idea is to make sports prediction competitive and fun, but still safe and accessible. Human beings do love turning everything into financial damage, so this is a nice change.`,
        })}
        {faqRow({
          title: "What makes StatOz different from fantasy or betting apps?",
          data: `StatOz focuses on prediction, quizzes, rewards, and leaderboard competition without real-money risk. It is meant to be a safe, skill-based entertainment product rather than a fantasy cash game or gambling app.`,
        })}
      </div>
      {showLayout && <FooterSection />}
    </div>
  );
}

export default FAQPage;
