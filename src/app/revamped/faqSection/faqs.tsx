import Image from "next/image";

export function faqRow({
  title,
  arrowBackgroundColor,
  data,
}: {
  title: string;
  arrowBackgroundColor?: boolean;
  data: string;
}) {
  return (
    <div className="flex mb-12">
      <span className=" flex-1 font-onest font-bold text-[24px] leading-[150%] text-[#0D111A] align-middle">
        {title}
      </span>
      <div
        className={`h-15 w-15 p-4 mx-10 ${
          arrowBackgroundColor ? "bg-[#5CDFFF]" : "bg-transparent"
        }`}
      >
        <Image
          src="/revamped/down_arrow.png"
          alt="arrow"
          width={24}
          height={24}
          className="object-contain"
        />
      </div>
      <span className=" flex-3 whitespace-pre-line font-onest font-regular text-[20px] leading-[150%] text-[#0D111A] align-middle">
        {data}
      </span>
    </div>
  );
}

function FAQSection() {
  return (
    <div className="flex flex-col my-20 mx-6">
      <span className="font-orbitron text-[64px] font-black">FAQs</span>
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
        title: "Can users win real money on StatOz?",
        data: `No. StatOz does not allow real-money wagering or cash withdrawal. The platform is designed so users compete for virtual rewards, status, and leaderboard progression instead of cash winnings.`,
      })}
      <div className="w-full h-[68px] opacity-100 gap-[10px] bg-white border-solid border-t border-r border-l border-b-2 border-t-[#90A1B9] border-r-[#90A1B9] border-l-[#90A1B9] border-b-[#90A1B9]">
        <div className="h-full flex justify-center items-center">
          <span className="font-onest font-bold text-[24px] text-[#0D111A]">
            {`View all FAQ's`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FAQSection;
