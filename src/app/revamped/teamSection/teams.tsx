import Image from "next/image";

function createLogo({ logo }: { logo: string }) {
  return (
    <div className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] rounded-[150px] bg-[#0000001A] opacity-100 mr-4">
      <Image
        src={logo}
        alt={logo}
        width={120}
        height={120}
        className="object-contain"
      />
    </div>
  );
}

function TeamsScetion() {
  return (
    <div className="mt-40 bg-[#1A253A] py-20 md:py-40 px-6">
      <div className="font-onest md:text-[40px] text-[32px] font-semibold text-white">
        Every sport has its arena. Your turn to play.
      </div>
      <div className="hidden md:flex  mt-10">
        {createLogo({ logo: "/revamped/f1_formula.png" })}
        {createLogo({ logo: "/revamped/ucl.png" })}
        {createLogo({ logo: "/revamped/laliga.png" })}
        {createLogo({ logo: "/revamped/nba_logo.png" })}
        {createLogo({ logo: "/revamped/ipl.png" })}
      </div>
      <div className=" md:hidden flex flex-col mt-10">
        <div className="flex items-center justify-between">
          {createLogo({ logo: "/revamped/ipl.png" })}
          {createLogo({ logo: "/revamped/f1_formula.png" })}
          {createLogo({ logo: "/revamped/ucl.png" })}
        </div>
        <div className="flex items-center justify-around mt-4">
          {createLogo({ logo: "/revamped/laliga.png" })}
          {createLogo({ logo: "/revamped/nba_logo.png" })}
        </div>
      </div>
    </div>
  );
}

export default TeamsScetion;
