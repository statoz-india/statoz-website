import Image from "next/image";

function ImageAsset() {
  return (
    <div className=" flex flex-col mt-20 mx-6">
      <div className=" flex justify-between">
        <Image
          src="/revamped/vk_ipl.png"
          alt="VK IPL"
          width={650}
          height={540}
          className="object-contain"
        />
        <Image
          src="/revamped/barca.png"
          alt="barca"
          width={650}
          height={540}
          className="object-contain"
        />
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

      <div className=" flex justify-between">
        <Image
          src="/revamped/nba.png"
          alt="nba"
          width={650}
          height={540}
          className="object-contain"
        />
        <Image
          src="/revamped/hamilton.png"
          alt="hamilton"
          width={650}
          height={540}
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default ImageAsset;
