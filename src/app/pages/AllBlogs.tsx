import { ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import svgPaths from "../../imports/svg-0swqsrs9fz";
import { Header } from "../components/Header";

interface BlogCardProps {
  title: string;
  image: string;
  onClick?: () => void;
}

function BlogCard({ title, image, onClick }: BlogCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[#191919] relative border-3 border-[#04080b] border-solid p-4 cursor-pointer group hover:border-[#5cdfff]/30 transition-all duration-300"
    >
      {/* Content Container */}
      <div className="flex flex-col gap-8">
        {/* Image and Arrow Row */}
        <div className="flex items-start justify-between w-full">
          {/* Image */}
          <div className="bg-[#bababa] h-[172px] w-[154px] overflow-hidden relative">
            <ImageWithFallback
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Arrow Icon */}
          <div className="flex items-center justify-center size-[31px]">
            <div className="rotate-90 text-[#5cdfff] group-hover:text-white transition-colors duration-300">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 31 31"
              >
                <path d={svgPaths.p51a800} fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <p className="font-orbitron font-extrabold leading-none text-[#5cdfff] text-base sm:text-lg md:text-xl uppercase line-clamp-2">
          {title}
        </p>
      </div>
    </div>
  );
}

export default function AllBlogs({
  onBack,
  onBlogClick,
}: {
  onBack: () => void;
  onBlogClick?: () => void;
}) {
  const allBlogs = [
    {
      title: "The Future of Football Predictions",
      image:
        "https://images.unsplash.com/photo-1730933900185-6bf7eeefe23f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHByZWRpY3Rpb24lMjBhbmFseXRpY3N8ZW58MXx8fHwxNzY5ODQwMTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Inside Gaming Generation",
      image:
        "https://images.unsplash.com/photo-1635372708431-64774de60e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nfGVufDF8fHx8MTc2OTc1NzM0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Match Analytics This Year",
      image:
        "https://images.unsplash.com/photo-1616778551732-6dd1289f567d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHRhY3RpY3MlMjBib2FyZHxlbnwxfHx8fDE3Njk4NDAyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Premier League Insights",
      image:
        "https://images.unsplash.com/photo-1764438300230-f1eb26b918cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMG1hdGNoJTIwYWN0aW9ufGVufDF8fHx8MTc2OTgxNTE4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Tactical Innovations in Modern Football",
      image:
        "https://images.unsplash.com/photo-1569184777314-103b0f84d8e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHRhY3RpY3N8ZW58MXx8fHwxNzY5ODQwMjU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Data Science in Sports Betting",
      image:
        "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzfGVufDF8fHx8MTc2OTc3NzQyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Champions League Predictions",
      image:
        "https://images.unsplash.com/photo-1676746424114-56d38af59256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFtcGlvbnMlMjBsZWFndWV8ZW58MXx8fHwxNzY5ODQwMjU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Building Your Prediction Strategy",
      image:
        "https://images.unsplash.com/photo-1529119368496-2dfda6ec2804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhdGVneSUyMHBsYW5uaW5nfGVufDF8fHx8MTc2OTg0MDI1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Top Transfer Predictions 2026",
      image:
        "https://images.unsplash.com/photo-1730816447853-192e89120832?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHRyYW5zZmVyfGVufDF8fHx8MTc2OTg0MDI1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Stats That Matter Most",
      image:
        "https://images.unsplash.com/photo-1759489036027-44eac680741a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGF0c3xlbnwxfHx8fDE3Njk4NDAyNTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Understanding xG and Advanced Metrics",
      image:
        "https://images.unsplash.com/flagged/photo-1639036711375-df3d6ef8232e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBhbmFseXRpY3N8ZW58MXx8fHwxNzY5ODQwMjU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "How to Win at Prediction Games",
      image:
        "https://images.unsplash.com/photo-1751700835846-e999696a6bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5uaW5nJTIwc3RyYXRlZ3l8ZW58MXx8fHwxNzY5ODQwMjU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D111A]">
      <Header />
      <section className="relative py-12 lg:py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#0D111A]" />

        <div className="container relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-32">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between w-full mb-8 lg:mb-12">
            <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl text-white uppercase">
              All Articles
            </h1>
            <button
              onClick={onBack}
              className="font-orbitron text-white/65 text-base lg:text-lg 2xl:text-xl hover:text-[#5cdfff] transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>

          {/* Grid Layout - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {allBlogs.map((blog, index) => (
              <BlogCard key={`all-${index}`} {...blog} onClick={onBlogClick} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
