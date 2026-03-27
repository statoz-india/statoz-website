import { trackPlaystoreClick } from "@/src/lib/analytics/playstoreClick";
import Image from "next/image";

const handlePlaystoreClick = () => {
  trackPlaystoreClick({ eventLabel: `virat_image_download_button` });
};

function DownloadButton() {
  return (
    <a
      href="https://play.google.com/store/apps/details?id=com.statoz.app"
      target="_blank"
      rel="noreferrer"
      onClick={() => handlePlaystoreClick()}
    >
      <div className="w-[249] h-[56] rounded-[100px] p-1 flex items-center gap-1 bg-[#FFFFFF4D] backdrop-blur-xs mb-4 md:mr-6 shrink-0">
        <div className="w-[190px] h-[48px] rounded-[98px] px-[14px] py-[10px] flex items-center justify-center gap-[10px] bg-[#5CDFFF] shrink-0">
          <span className="font-onest text-[18px] font-extrabold text-[#1A253A] uppercase">
            Download Now
          </span>
        </div>
        <div className="w-[47px] h-[47px] rounded-[100px] bg-[#000000] border border-[#FFFFFF] flex items-center justify-center z-30">
          <Image
            src="/revamped/download.png"
            alt="download"
            width={28}
            height={28}
            className="object-contain"
          />
        </div>
      </div>
    </a>
  );
}

function ImageAsset() {
  return (
    <div className=" flex flex-col mt-10 ">
      <div className="md:hidden font-onest text-[16px] font-medium mx-4 mb-10">
        A free-to-play prediction layer for sports community
      </div>
      <div className=" flex flex-col md:flex-row justify-between ">
        <div className="relative md:w-full aspect-65/54 mx-4 my-2 md:my-0">
          <Image
            src="/revamped/vk_ipl.png"
            alt="VK IPL"
            fill
            className="object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <DownloadButton />
          </div>
        </div>

        <div className="relative md:w-full aspect-65/54 mx-4 my-2 md:my-0">
          <Image
            src="/revamped/barca.png"
            alt="barca"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="hidden md:flex self-center">
        <Image
          src="/revamped/logo.png"
          alt="statoz"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between ">
        <div className="relative md:w-full aspect-65/54 mx-4 my-2 md:my-0">
          <Image
            src="/revamped/nba.png"
            alt="nba"
            fill
            className="object-contain"
          />
        </div>
        <div className="relative md:w-full aspect-65/54 mx-4 my-2 md:my-0">
          <Image
            src="/revamped/hamilton.png"
            alt="hamilton"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default ImageAsset;
