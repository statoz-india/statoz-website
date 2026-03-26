import { Quote } from "lucide-react";

function QuotesSection() {
  return (
    <div className="flex flex-col my-30">
      <Quote
        className="w-[100px] h-[100px] rotate-180"
        strokeWidth={0}
        fill="#1F20231A"
      />
      <span className="font-onest text-[40px] font-black ml-4 uppercase mr-20">
        Turn every match into structured participation & reward player Without
        Gambling.
      </span>
    </div>
  );
}

export default QuotesSection;
