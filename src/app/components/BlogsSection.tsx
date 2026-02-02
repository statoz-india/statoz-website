import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import svgPaths from "../../imports/svg-0swqsrs9fz";
import stadiumSvgPaths from "../../imports/svg-xs8igyqenl";
import { useNavigate } from "react-router-dom";

interface BlogCardProps {
  title: string;
  image: string;
  dark?: boolean;
  onClick?: () => void;
}

// Desktop Blog Card - Horizontal Layout
function DesktopBlogCard({ title, image, onClick }: BlogCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[#191919] relative border-3 border-[#04080b] border-solid p-4 w-full cursor-pointer group hover:border-[#5cdfff]/30 transition-all duration-300"
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
        <p className="font-jakarta font-extrabold leading-none text-[#5cdfff] text-lg xl:text-xl 2xl:text-2xl line-clamp-2">
          {title}
        </p>
      </div>
    </div>
  );
}

// Tablet/Mobile Blog Card - Vertical Layout
function ResponsiveBlogCard({ title, image, onClick }: BlogCardProps) {
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

// Featured Stadium Image Component
function FeaturedStadiumImage() {
  return (
    <div className="relative w-full h-full">
      <svg
        className="absolute inset-0 w-full h-full"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 574 508.502"
      >
        <defs>
          <clipPath id="stadium-clip">
            <path d={stadiumSvgPaths.p12211f80} />
          </clipPath>
        </defs>
        <g clipPath="url(#stadium-clip)">
          <image
            href="https://images.unsplash.com/photo-1679391029864-d46f366a456b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBuaWdodHxlbnwxfHx8fDE3Njk4NDAxOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            x="0"
            y="0"
            width="574"
            height="508.502"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
        <path
          d={stadiumSvgPaths.p12211f80}
          fill="none"
          stroke="#00d3f2"
          strokeWidth="2"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

export default function BlogsSection({
  onBlogClick,
}: {
  onBlogClick?: () => void;
}) {
  const navigate = useNavigate();

  const leftBlogs = [
    {
      title: "The Future of Football Predictions",
      image:
        "https://images.unsplash.com/photo-1730933900185-6bf7eeefe23f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHByZWRpY3Rpb24lMjBhbmFseXRpY3N8ZW58MXx8fHwxNzY5ODQwMTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      dark: true,
    },
    {
      title: "Inside Gaming Generation",
      image:
        "https://images.unsplash.com/photo-1767455471543-055dbc6c6700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nJTIwY29tcGV0aXRpb258ZW58MXx8fHwxNzY5Nzg5NDE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      dark: false,
    },
  ];

  const rightBlogs = [
    {
      title: "Match Analytics This Year",
      image:
        "https://images.unsplash.com/photo-1603683180670-89e591ecf86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHRhY3RpY3MlMjBzdHJhdGVneXxlbnwxfHx8fDE3Njk4NDAxOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      dark: false,
    },
    {
      title: "Premier League Insights",
      image:
        "https://images.unsplash.com/photo-1701363539457-875b9bc9bbc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaWVyJTIwbGVhZ3VlJTIwZm9vdGJhbGwlMjBtYXRjaHxlbnwxfHx8fDE3Njk4NDAxOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      dark: true,
    },
  ];

  const allBlogs = [...leftBlogs, ...rightBlogs];

  return (
    <section className="relative py-12 lg:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0D111A]" />

      <div className="container relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-32">
        {/* Desktop Layout - 3 Column Grid (lg and up) */}
        <div className="hidden lg:block">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between w-full">
              <h2 className="font-orbitron font-extrabold text-2xl xl:text-3xl 2xl:text-4xl text-white uppercase">
                StatOz News
              </h2>
              <button
                onClick={() => navigate("/blogs")}
                className="font-orbitron text-white/65 text-base xl:text-lg 2xl:text-xl hover:text-[#5cdfff] transition-colors whitespace-nowrap"
              >
                View All
              </button>
            </div>

            {/* Three Column Layout */}
            <div className="flex items-start gap-6 xl:gap-10 2xl:gap-[50px]">
              {/* Left Column */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-4 xl:gap-6 2xl:gap-[25px]">
                  {leftBlogs.map((blog, index) => (
                    <DesktopBlogCard
                      key={`left-${index}`}
                      {...blog}
                      onClick={onBlogClick}
                    />
                  ))}
                </div>
              </div>

              {/* Center Featured Image */}
              <div className="shrink-0 w-[280px] xl:w-[400px] 2xl:w-[574px]">
                <div className="w-full aspect-[574/508.502]">
                  <FeaturedStadiumImage />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-4 xl:gap-6 2xl:gap-[27px]">
                  {rightBlogs.map((blog, index) => (
                    <DesktopBlogCard
                      key={`right-${index}`}
                      {...blog}
                      onClick={onBlogClick}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet Layout - 2 Column Grid (md to lg) */}
        <div className="hidden md:block lg:hidden">
          <div className="flex items-center justify-between w-full mb-8 md:mb-10">
            <h2 className="font-orbitron font-extrabold text-2xl md:text-3xl text-white uppercase tracking-wider">
              StatOz News
            </h2>
            <button
              onClick={() => navigate("/blogs")}
              className="font-orbitron text-white/65 text-base md:text-lg hover:text-[#5cdfff] transition-all duration-300 whitespace-nowrap hover:scale-105 flex items-center gap-2 group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Featured Image with Enhanced Frame */}
          <div className="mb-8 md:mb-12 max-w-3xl mx-auto">
            <div className="relative p-4 md:p-6 bg-linear-to-br from-[#5cdfff]/10 to-transparent rounded-lg border-2 border-[#5cdfff]/20 hover:border-[#5cdfff]/40 transition-all duration-500 group">
              <div className="w-full aspect-[574/508.502] overflow-hidden rounded-md">
                <div className="w-full h-full group-hover:scale-105 transition-transform duration-700">
                  <FeaturedStadiumImage />
                </div>
              </div>
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#5cdfff] opacity-60"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#5cdfff] opacity-60"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#5cdfff] opacity-60"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#5cdfff] opacity-60"></div>
            </div>
          </div>

          {/* Blog Grid - 2 columns with enhanced spacing */}
          <div className="grid grid-cols-2 gap-6 md:gap-8">
            {allBlogs.map((blog, index) => (
              <div
                key={`tablet-${index}`}
                className="transform hover:scale-[1.02] transition-transform duration-300"
              >
                <ResponsiveBlogCard {...blog} onClick={onBlogClick} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout - Single Column (below md) */}
        <div className="md:hidden">
          <div className="flex items-center justify-between w-full mb-6">
            <h2 className="font-orbitron font-extrabold text-lg sm:text-xl text-white uppercase">
              StatOz News
            </h2>
            <button
              onClick={() => navigate("/blogs")}
              className="font-orbitron text-white/65 text-sm sm:text-base hover:text-[#5cdfff] transition-colors whitespace-nowrap"
            >
              View All
            </button>
          </div>

          {/* Featured Image */}
          <div className="mb-6">
            <div className="relative w-full aspect-square overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 via-cyan-500/20 to-orange-500/20 z-10" />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1679391029864-d46f366a456b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBuaWdodHxlbnwxfHx8fDE3Njk4NDAxOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Featured article"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Blog Cards - Stacked */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {allBlogs.map((blog, index) => (
              <ResponsiveBlogCard
                key={`mobile-${index}`}
                {...blog}
                onClick={onBlogClick}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
