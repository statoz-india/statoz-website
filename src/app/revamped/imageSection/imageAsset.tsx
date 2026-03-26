import Image from "next/image";

function ImageAsset() {
  return (
    <div className=" flex flex-col mt-20 ">
      <div className=" flex justify-between">
        <div className="relative w-full aspect-65/54 mx-4">
          <Image
            src="/revamped/vk_ipl.png"
            alt="VK IPL"
            fill
            className="object-contain"
          />
        </div>

        <div className="relative w-full aspect-65/54 mx-4">
          <Image
            src="/revamped/barca.png"
            alt="barca"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="self-center">
        <Image
          src="/revamped/logo.png"
          alt="statoz"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      <div className=" flex justify-between ">
        <div className="relative w-full aspect-65/54 mx-4">
          <Image
            src="/revamped/nba.png"
            alt="nba"
            fill
            className="object-contain"
          />
        </div>
        <div className="relative w-full aspect-65/54 mx-4">
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
