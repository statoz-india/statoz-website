"use client";

import { trackPlaystoreClick } from "../../../lib/analytics/playstoreClick";
import Image from "next/image";

const handlePlaystoreClick = (eventLabel: string, linkUrl: string) => {
  trackPlaystoreClick({ eventLabel: eventLabel, link_url: linkUrl });
};

function SocialMediaRow({
  socialMedia,
  link,
}: {
  socialMedia: string;
  link: string;
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      onClick={() =>
        handlePlaystoreClick(`${socialMedia.toLowerCase()}_footer_click`, link)
      }
    >
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
    </a>
  );
}

function FooterSection() {
  return (
    <div className="bg-[#0D111A] py-16 px-4 flex flex-col">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 ">
          <span className="font-onest text-[16px] font-regular text-white">
            StatOz is India’s sports prediction gaming platform. Users predict
            match outcomes, answer match quizzes, play daily sports mini-games,
            and compete on social leaderboards - all powered by a virtual coin
            economy. 100% free to play. No real money. Ever.
          </span>
        </div>
        <div className="flex-1 mt-10 md:mt-0 md:mx-16 mx-0">
          <div className="flex flex-col">
            <span className="font-orbitron text-[24px] font-bold text-white uppercase">
              Social Media
            </span>
            <div className="flex mt-6">
              <SocialMediaRow
                socialMedia={"Instagram"}
                link={`https://www.instagram.com/statozindia/`}
              />
              <SocialMediaRow
                socialMedia={"Twitter"}
                link={"https://x.com/StatOzindia"}
              />
              <SocialMediaRow
                socialMedia={"Youtube"}
                link={"https://www.youtube.com/@StatozIndia"}
              />
            </div>
            <div className="flex mt-2">
              <SocialMediaRow
                socialMedia={"WhatsApp"}
                link={"https://chat.whatsapp.com/JxKL3sVI7S88qNe0pYXo77"}
              />
              <SocialMediaRow
                socialMedia={"Linkedin"}
                link={"https://www.linkedin.com/company/statoz/"}
              />
              <SocialMediaRow
                socialMedia={"Reddit"}
                link={"https://www.reddit.com/r/f2p__predictionmarket/"}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 mt-10 md:mt-0 md:mx-16 mx-0">
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
            <a
              href="mailto:founders@statoz.in"
              className="font-onest text-[18px] font-medium text-white"
            >
              founders@statoz.in
            </a>
          </div>
        </div>
      </div>
      <div className="h-px bg-[#333E4F] mt-16"></div>
      <div className="flex mt-8">
        <span className="font-onest text-[16px] font-medium text-white">
          © Copyright 2026, All Rights Reserved
        </span>
      </div>
    </div>
  );
}

export default FooterSection;
