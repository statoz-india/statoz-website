import Image from "next/image";

function SocialMediaRow({
  socialMedia,
  link,
}: {
  socialMedia: string;
  link: string;
}) {
  return (
    <div className="flex flex-row mr-6">
      <span className="font-onest text-[16px] font-regular text-white">
        {socialMedia}
      </span>
      <Image
        src={"/revamped/down_arrow_white.png"}
        alt={"arrow"}
        width={10}
        height={10}
        className="object-contain ml-[2px]"
      />
    </div>
  );
}

function FooterSection() {
  return (
    <div className="bg-[#0D111A] py-16 px-4 flex flex-col">
      <div className="flex">
        <div className="flex-1 ">
          <span className="font-onest text-[16px] font-regular text-white">
            StatOz is India’s sports prediction gaming platform. Users predict
            match outcomes, answer match quizzes, play daily sports mini-games,
            and compete on social leaderboards - all powered by a virtual coin
            economy. 100% free to play. No real money. Ever.
          </span>
        </div>
        <div className="flex-1 mx-16">
          <div className="flex flex-col">
            <span className="font-orbitron text-[24px] font-bold text-white uppercase">
              Social Media
            </span>
            <div className="flex mt-6">
              <SocialMediaRow socialMedia={"Instagram"} link={""} />
              <SocialMediaRow socialMedia={"Twitter"} link={""} />
              <SocialMediaRow socialMedia={"Youtube"} link={""} />
            </div>
            <div className="flex mt-2">
              <SocialMediaRow socialMedia={"Facebbok"} link={""} />
              <SocialMediaRow socialMedia={"Linkedin"} link={""} />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-col">
            <span className="font-orbitron text-[24px] font-bold text-white uppercase">
              Phone
            </span>
            <span className="font-onest text-[18px] font-medium text-white uppercase">
              [+91] 90191 18429
            </span>

            <span className="font-orbitron text-[24px] font-bold text-white uppercase mt-12">
              Email
            </span>
            <span className="font-onest text-[18px] font-medium text-white">
              founder@statoz.in
            </span>
          </div>
        </div>
      </div>
      <div className="h-px bg-[#333E4F] mt-16"></div>
      <div className="flex mt-8">
        <span className="font-onest text-[16px] font-medium text-white">
          © Copyright 2025, All Rights Reserved
        </span>
      </div>
    </div>
  );
}

export default FooterSection;
