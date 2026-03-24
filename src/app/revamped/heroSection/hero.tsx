import Image from "next/image";

function HeroSection() {
  return (
    <div className="bg-[linear-gradient(180deg,#000000_0%,#131D31_25%,#1D293D_50%,#131D31_75%,#000000_100%)]">
      {/* Top Nav Bar */}
      <div className="w-full px-6 md:px-10 py-5 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center ">
          <Image
            src="/revamped/logo_text.png"
            alt="StatOz logo"
            width={78}
            height={24}
            className="h-auto w-auto"
            priority
          />
        </div>

        {/* Center: nav buttons */}
        <div className="hidden md:flex items-center gap-8 text-white">
          <button className="font-onest font-[16px] text-white">Game</button>
          <button className="font-onest font-[16px] text-white">Blogs</button>
          <button className="font-onest font-[16px] text-white">FAQ</button>
        </div>
        {/* Right: CTA */}
        <div>
          <button className="w-[176px] h-[56px] border-[1.5px] border-[rgba(15,23,43,0.95)] bg-[rgba(15,23,43,0.95)] opacity-100 gap-2 py-4 px-8 text-white font-medium transition-colors hover:bg-[rgba(15,23,43,1)]">
            Download Now
          </button>
        </div>
      </div>

      {/* Ipl Arena Image */}
      <div className="flex items-center justify-center">
        <div className="h-[64px] w-[16px] bg-[#005A70] [clip-path:polygon(25%_0%,75%_0%,100%_12%,100%_88%,75%_100%,25%_100%,0%_88%,0%_12%)]" />
        <div className="mx-8">
          <Image
            src="/revamped/ipl_arena.png"
            alt="IPL arena"
            width={430}
            height={40}
            className="object-contain"
            priority
          />
        </div>
        <div className="h-[64px] w-[16px] bg-[#005A70] [clip-path:polygon(25%_0%,75%_0%,100%_12%,100%_88%,75%_100%,25%_100%,0%_88%,0%_12%)]" />
      </div>

      {/* Features */}
      <div className="flex items-center justify-center mt-5">
        <div className="px-4 py-3 mx-1 bg-[#0F172B80] border border-[#1D293D] flex items-center justify-cente">
          <Image
            src="/revamped/prize_pool.png"
            alt="Prize pool"
            width={24}
            height={24}
            className="object-contain"
            priority
          />
          <div className="w-3"></div>
          <span className="font-onest text-white text-[14px] font-bold uppercase">
            10k Prize Pool
          </span>
        </div>
        <div className="px-4 py-3 mx-1 bg-[#0F172B80] border border-[#1D293D] flex items-center justify-cente">
          <Image
            src="/revamped/free_play.png"
            alt="Free Play"
            width={24}
            height={24}
            className="object-contain"
            priority
          />
          <div className="w-3"></div>
          <span className="font-onest text-white text-[14px] font-bold uppercase">
            Free to Play
          </span>
        </div>
        <div className="px-4 py-3 mx-1 bg-[#0F172B80] border border-[#1D293D] flex items-center justify-cente">
          <Image
            src="/revamped/live_matches.png"
            alt="Live Matches"
            width={24}
            height={24}
            className="object-contain"
            priority
          />
          <div className="w-3"></div>
          <span className="font-onest text-white text-[14px] font-bold uppercase">
            Live Matches
          </span>
        </div>
      </div>

      {/* Predict Match text */}
      <div className="flex items-center justify-center my-2">
        <span className="font-onest text-[#90A1B9] text-[14px]">
          Predict Match Events & Win Prizes
        </span>
      </div>

      {/* IPL Players */}
      <div className="mt-9 flex flex-col items-center">
        <Image
          src="/revamped/statoz_text.png"
          alt="Statoz Text"
          width={800}
          height={137}
          className="object-contain"
          priority
        />
        <Image
          src="/revamped/exclude.png"
          alt="Exclude"
          width={800}
          height={544}
          className="object-contain -mt-12"
          priority
        />
      </div>
    </div>
  );
}

export default HeroSection;
