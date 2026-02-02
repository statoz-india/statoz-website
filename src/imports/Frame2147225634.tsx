import svgPaths from "./svg-0swqsrs9fz";

function RiArrowUpLine() {
  return (
    <div className="relative size-[31px]" data-name="ri:arrow-up-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 31">
        <g id="ri:arrow-up-line">
          <path d={svgPaths.p51a800} fill="var(--fill-0, #E8F4EA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <div className="bg-[#bababa] h-[172px] shrink-0 w-[154px]" data-name="image" />
      <div className="flex items-center justify-center relative shrink-0 size-[31px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <RiArrowUpLine />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[33px] items-start justify-center relative shrink-0 w-full">
      <Frame2 />
      <p className="css-4hzbpn font-['Anton:Regular',sans-serif] leading-none not-italic relative shrink-0 text-[#82f26e] text-[36px] uppercase w-full">The Future Of esport</p>
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-[#191919] content-stretch flex flex-col items-start p-[16px] relative size-full">
      <div aria-hidden="true" className="absolute border-3 border-[#04080b] border-solid inset-0 pointer-events-none" />
      <Frame />
    </div>
  );
}