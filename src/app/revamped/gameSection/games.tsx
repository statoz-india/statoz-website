import { ArrowRight } from "lucide-react";
import Image from "next/image";

function MakeSportsRow({
  sportName,
  sportsImage,
}: {
  sportName: string;
  sportsImage: string;
}) {
  return (
    <div className="w-[453.73px] h-[55px] rounded-[100px] p-1 flex items-center gap-1 bg-[#D1D1D1] mb-4 mr-6">
      <div className="w-[400px] h-[47px] rounded-[98px] px-[14px] py-[10px] flex items-center justify-center gap-[10px] bg-[linear-gradient(135deg,#1D293D_0%,#0F172B_100%)]">
        <span className="font-onest text-[20px] text-white">{sportName}</span>
      </div>
      <div className="w-[48px] h-[48px] rounded-[100px] bg-[#FFFFFFAB] border border-[#FFFFFF] flex items-center justify-center z-30">
        <Image
          src={sportsImage}
          alt={sportName}
          width={28}
          height={28}
          className="object-contain"
        />
      </div>
    </div>
  );
}

function GameSection() {
  return (
    <div className="mt-40 mx-6">
      <div className="flex items-center">
        <span className="font-orbitron text-[64px] font-black">F2P</span>
        <div className="w-[20px] h-[20px] bg-[#5CDFFF] rotate-135 opacity-100" />
        <span className="font-orbitron text-[64px] font-black mx-4">
          Live Service
        </span>
        <div className="w-[20px] h-[20px] bg-[#5CDFFF] rotate-135 opacity-100" />
        <span className="font-orbitron text-[64px] font-black mx-4">
          Sports Game
        </span>
      </div>
      <div className="flex flex-row mt-[96px]">
        <div className="flex flex-col mr-10">
          <span className="font-onest text-[32px] font-black">{"//"}</span>
          <span className="font-onest text-[32px] font-black">
            Predict future events. Climb the leaderboard & earn rewards.
          </span>
          <span className="font-onest text-[18px] font-medium text-right mt-12 mb-10">
            No financial risk prediction market using Oz Coins. Win & use in
            coin store.
          </span>
          <MakeSportsRow
            sportName={"CRICKET"}
            sportsImage={"/revamped/cricket.png"}
          />
          <div className="self-end">
            <MakeSportsRow
              sportName={"MOTORSPORT"}
              sportsImage={"/revamped/motorsport.png"}
            />
          </div>
          <MakeSportsRow
            sportName={"FOOTBALL"}
            sportsImage={"/revamped/football.png"}
          />
          <div className="self-end">
            <MakeSportsRow
              sportName={"BASKETBALL"}
              sportsImage={"/revamped/basketball.png"}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="w-[676px] h-[190px] bg-[#EFEFEF] px-4 py-6 gap-[10px] rounded-none flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex -space-x-3">
                <div className="w-[48px] h-[48px] rounded-[100px] bg-[#5CDFFF] flex items-center justify-center z-40">
                  <span className="font-orbitron text-[16px] font-bold text-[#0F172B] ">
                    1
                  </span>
                </div>
                <div className="w-[48px] h-[48px] rounded-[100px] bg-white border border-[#0000004D] flex items-center justify-center z-30">
                  <span className="font-orbitron text-[16px] font-bold text-black">
                    2
                  </span>
                </div>
                <div className="w-[48px] h-[48px] rounded-[100px] bg-white border border-[#0000004D] flex items-center justify-center z-20">
                  <span className="font-orbitron text-[16px] font-bold text-black">
                    3
                  </span>
                </div>
                <div className="w-[48px] h-[48px] rounded-[100px] bg-white border border-[#0000004D] flex items-center justify-center z-10">
                  <span className="font-orbitron text-[16px] font-bold text-black">
                    4
                  </span>
                </div>
              </div>
              <ArrowRight className="w-[30px] h-[30px] text-[#0B5593] ml-2" />
            </div>
            <span className="font-onest text-[16px] font-black">Sports</span>
          </div>
          <div className="self-center">
            <Image
              src={"/revamped/prediction.png"}
              alt={"Prediction"}
              width={312}
              height={350}
              className="object-contain mt-12"
            />
          </div>
          <div className=" h-[8px] bg-[#5CDFFF]" />
        </div>
      </div>
    </div>
  );
}

export default GameSection;
