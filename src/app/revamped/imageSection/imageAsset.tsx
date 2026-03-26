import Image from "next/image";

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
