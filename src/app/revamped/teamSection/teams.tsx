import Image from "next/image";

function createLogo({ logo }: { logo: string }) {
  return (
    <div className="w-[120px] h-[120px] rounded-[150px] bg-[#0000001A] opacity-100 mr-4">
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
    <div className="mt-40 bg-[#1A253A] py-40 px-6">
      <div className="font-onest text-[40px] font-semibold text-white">
        Every sport has its arena. Your turn to play.
      </div>
      <div className="flex mt-10">
        {createLogo({ logo: "/revamped/f1_formula.png" })}
        {createLogo({ logo: "/revamped/ucl.png" })}
        {createLogo({ logo: "/revamped/laliga.png" })}
        {createLogo({ logo: "/revamped/nba_logo.png" })}
        {createLogo({ logo: "/revamped/ipl.png" })}
      </div>
    </div>
  );
}

export default TeamsScetion;
