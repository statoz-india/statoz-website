import { useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  TrendingUp,
  Target,
  Users,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Header } from "../components/Header";

interface BlogDetailPageProps {
  onBack: () => void;
}

// SEO Metadata Component
function SEOHead() {
  useEffect(() => {
    // Set page title
    document.title = "T20 World Cup: The Ultimate Prediction Arena | Statoz";

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Discover how Statoz is revolutionizing T20 World Cup predictions with 1v1 battles, real-time scoring, and skill-based gaming. Bet on 100+ live events."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Discover how Statoz is revolutionizing T20 World Cup predictions with 1v1 battles, real-time scoring, and skill-based gaming. Bet on 100+ live events.";
      document.head.appendChild(meta);
    }

    // Set meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute(
        "content",
        "T20 World Cup, cricket predictions, sports gaming, skill-based predictions, 1v1 battles, fantasy cricket, Statoz, prediction arena"
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content =
        "T20 World Cup, cricket predictions, sports gaming, skill-based predictions, 1v1 battles, fantasy cricket, Statoz, prediction arena";
      document.head.appendChild(meta);
    }

    // Cleanup function to reset title on unmount
    return () => {
      document.title = "Statoz - Predict. Play. Dominate.";
    };
  }, []);

  return null;
}

// Feature Card Component - Reusable
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  borderColor: string;
}

function FeatureCard({
  icon,
  title,
  description,
  borderColor,
}: FeatureCardProps) {
  return (
    <article
      className={`bg-[#1a1a1a] border-2 ${borderColor} p-4 md:p-5 rounded-lg hover:scale-105 transition-transform duration-300`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="text-[#5cdfff]">{icon}</div>
        <h3 className="font-orbitron font-bold text-lg md:text-xl text-white">
          {title}
        </h3>
      </div>
      <p className="font-plus-jakarta text-sm md:text-base text-white/70 leading-relaxed">
        {description}
      </p>
    </article>
  );
}

// Prediction Category Item - Reusable
interface PredictionItemProps {
  title: string;
  description: string;
}

function PredictionItem({ title, description }: PredictionItemProps) {
  return (
    <li className="flex items-start gap-3">
      <span className="text-[#5cdfff] font-bold mt-1 shrink-0">→</span>
      <span className="font-plus-jakarta text-base md:text-lg text-white/80">
        <strong className="text-white">{title}:</strong> {description}
      </span>
    </li>
  );
}

// Article Section Component - Reusable
interface ArticleSectionProps {
  title: string;
  titleColor: string;
  children: React.ReactNode;
}

function ArticleSection({ title, titleColor, children }: ArticleSectionProps) {
  return (
    <section className="mb-8 md:mb-10">
      <h2
        className={`font-orbitron font-bold text-2xl md:text-3xl ${titleColor} mb-4 md:mb-6 uppercase`}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function BlogDetailPage({ onBack }: BlogDetailPageProps) {
  return (
    <>
      <SEOHead />
      <Header />
      <article className="min-h-screen bg-[#0D111A] relative overflow-hidden">
        {/* Animated Background Gradients */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5cdfff]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#5cdfff]/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#5cdfff]/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 container max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 lg:py-16">
          {/* Back Navigation */}
          <nav className="mb-6 md:mb-8" aria-label="Breadcrumb">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/70 hover:text-[#5cdfff] transition-colors group"
              aria-label="Back to articles"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-orbitron text-sm md:text-base">
                Back to Articles
              </span>
            </button>
          </nav>

          {/* Article Header */}
          <header className="mb-8 md:mb-12">
            <h1 className="font-orbitron font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase text-[#5cdfff] mb-4 md:mb-6 leading-tight">
              T20 World Cup: The Ultimate Prediction Arena
            </h1>

            {/* Article Meta Information */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/60 font-orbitron text-xs md:text-sm">
              <time dateTime="2026-01-20" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>January 20, 2026</span>
              </time>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>5 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" aria-hidden="true" />
                <span>Statoz Team</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <figure className="relative w-full aspect-video mb-8 md:mb-12 rounded-lg overflow-hidden border-2 border-[#5cdfff]/30">
            <div
              className="absolute inset-0 bg-[#5cdfff]/20 z-10"
              aria-hidden="true"
            />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1675693303492-9a5bc898bf94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmlja2V0JTIwc3RhZGl1bSUyMG5pZ2h0fGVufDF8fHx8MTc2OTg0MDI1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Illuminated T20 World Cup cricket stadium packed with fans at night showcasing the ultimate prediction gaming arena"
              className="w-full h-full object-cover"
            />
            <figcaption className="sr-only">
              T20 World Cup Stadium filled with enthusiastic cricket fans
            </figcaption>
          </figure>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none">
            {/* Introduction / Summary */}
            <aside
              className="bg-[#5cdfff]/10 border-l-4 border-[#5cdfff] p-4 md:p-6 rounded-r-lg mb-8"
              role="note"
            >
              <p className="font-plus-jakarta text-base md:text-lg text-white/90 leading-relaxed m-0">
                The T20 World Cup represents the pinnacle of fast-paced cricket
                action, and at <strong>Statoz</strong>, we`re transforming how
                fans engage with the tournament through our revolutionary
                prediction gaming platform that combines skill-based competition
                with 100+ live betting opportunities.
              </p>
            </aside>

            {/* Section 1 */}
            <ArticleSection
              title="Why T20 Predictions?"
              titleColor="text-[#5cdfff]"
            >
              <p className="font-plus-jakarta text-base md:text-lg text-white/80 leading-relaxed mb-4">
                T20 cricket is unpredictable, thrilling, and perfect for our
                arcade-style prediction battles. Every ball can change the game,
                making real-time predictions incredibly engaging. Our platform
                lets you predict match outcomes, player performances, and key
                moments before they happen.
              </p>
              <p className="font-plus-jakarta text-base md:text-lg text-white/80 leading-relaxed">
                Unlike traditional fantasy leagues, we focus on{" "}
                <strong className="text-[#5cdfff]">
                  skill-based predictions
                </strong>{" "}
                that test your cricket knowledge and analytical abilities in
                head-to-head battles. This isn`t about luck—it`s about
                expertise.
              </p>
            </ArticleSection>

            {/* Section 2 - Features */}
            <ArticleSection
              title="How Statoz Is Different"
              titleColor="text-[#5cdfff]"
            >
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-6">
                <FeatureCard
                  icon={<Users className="w-6 h-6" />}
                  title="1v1 Arcade Battles"
                  description="Challenge friends or random opponents to prediction duels during live matches."
                  borderColor="border-[#5cdfff]/20"
                />
                <FeatureCard
                  icon={<TrendingUp className="w-6 h-6" />}
                  title="Real-Time Scoring"
                  description="Get instant feedback as your predictions are validated ball-by-ball."
                  borderColor="border-[#5cdfff]/20"
                />
                <FeatureCard
                  icon={<Target className="w-6 h-6" />}
                  title="Global Leaderboards"
                  description="Compete against cricket prediction experts worldwide for bragging rights."
                  borderColor="border-[#5cdfff]/20"
                />
                <FeatureCard
                  icon={<TrendingUp className="w-6 h-6" />}
                  title="Zero Entry Fees"
                  description="100% free-to-play. Pure skill, pure fun, pure competition."
                  borderColor="border-[#5cdfff]/20"
                />
              </div>
            </ArticleSection>

            {/* Section 3 - Prediction Categories */}
            <ArticleSection
              title="Prediction Categories for T20 World Cup"
              titleColor="text-[#5cdfff]"
            >
              <ul className="space-y-3 list-none p-0" role="list">
                <PredictionItem
                  title="Match Winners"
                  description="Predict the outcome before the first ball"
                />
                <PredictionItem
                  title="Top Scorer"
                  description="Who will score the most runs in the match?"
                />
                <PredictionItem
                  title="Best Bowler"
                  description="Predict the bowler with the most wickets"
                />
                <PredictionItem
                  title="Power Play Performance"
                  description="Total runs in the first 6 overs"
                />
                <PredictionItem
                  title="Death Overs Dominance"
                  description="How many boundaries in the final 4 overs?"
                />
              </ul>
            </ArticleSection>

            {/* Quote Section */}
            <blockquote className="bg-[#1a1a1a] border-l-4 border-[#5cdfff] p-6 md:p-8 rounded-r-lg mb-8 md:mb-10">
              <p className="font-orbitron text-lg md:text-xl text-white/90 italic mb-3 m-0">
                &quot;We&apos;re not just watching cricket. We&apos;re
                predicting it, competing with it, and dominating it.&quot;
              </p>
              <footer className="font-plus-jakarta text-sm md:text-base text-white/60">
                — Statoz Vision
              </footer>
            </blockquote>

            {/* Section 4 - Call to Action */}
            <ArticleSection
              title="Join Statoz This T20 Season"
              titleColor="text-[#5cdfff]"
            >
              <p className="font-plus-jakarta text-base md:text-lg text-white/80 leading-relaxed mb-4">
                Whether you&apos;re a cricket statistician, a casual fan, or
                someone who just loves the thrill of competition, our T20 World
                Cup prediction battles are designed for you. Test your cricket
                IQ, challenge your friends, and see if you have what it takes to
                dominate the global leaderboards.
              </p>
              <p className="font-plus-jakarta text-base md:text-lg text-white/80 leading-relaxed">
                The best part?{" "}
                <strong className="text-[#5cdfff]">
                  It&apos;s completely free
                </strong>
                . No hidden costs, no paywalls, just pure skill-based gaming
                wrapped in an electrifying arcade experience.
              </p>
            </ArticleSection>

            {/* CTA Section */}
            <aside
              className="bg-[#5cdfff]/10 border-2 border-[#5cdfff]/30 p-6 md:p-8 rounded-lg text-center"
              role="complementary"
            >
              <h3 className="font-orbitron font-bold text-xl md:text-2xl text-white mb-3 uppercase">
                Ready to Predict. Play. Dominate?
              </h3>
              <p className="font-plus-jakarta text-sm md:text-base text-white/70 mb-5">
                Join our waitlist and be the first to experience the future of
                cricket prediction gaming with Statoz.
              </p>
              <button
                className="bg-[#5cdfff] hover:bg-[#4dcfef] text-[#0d1b4b] font-orbitron font-bold px-6 md:px-8 py-3 md:py-4 rounded-lg text-sm md:text-base uppercase transition-all duration-300 shadow-lg hover:shadow-[#5cdfff]/50 hover:scale-105"
                aria-label="Join the Statoz waitlist"
              >
                Join the Waitlist
              </button>
            </aside>
          </div>
        </div>

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: "T20 World Cup: The Ultimate Prediction Arena",
              description:
                "Discover how Statoz is revolutionizing T20 World Cup predictions with 1v1 battles, real-time scoring, and skill-based gaming. Bet on 100+ live events.",
              author: {
                "@type": "Organization",
                name: "Statoz Team",
              },
              datePublished: "2026-01-20",
              publisher: {
                "@type": "Organization",
                name: "Statoz",
              },
              mainEntityOfPage: {
                "@type": "WebPage",
              },
              keywords:
                "T20 World Cup, cricket predictions, sports gaming, skill-based predictions, 1v1 battles, fantasy cricket, Statoz",
            }),
          }}
        />
      </article>
    </>
  );
}
