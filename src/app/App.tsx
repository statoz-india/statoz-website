"use client";
import GameSection from "./revamped/gameSection/games";
import HeroSection from "./revamped/heroSection/hero";

// export default function App() {
//   useEffect(() => {
//     initializeErrorHandler();
//   }, []);

//   return (
//     <ErrorBoundary>
//       <div className="min-h-screen bg-[#0D111A] flex flex-col">
//         <Header blogHref="/allblogs" homeHref="/" />
//         <main className="flex-1">
//           <HeroSection />
//           <StatsSection />
//           <FeaturesSection />
//           <TournamentsSection />
//           <HowItWorks />
//           <DownloadSection />
//           <BlogsSection viewAllHref="/allblogs" />
//         </main>
//         <Footer />
//       </div>
//     </ErrorBoundary>
//   );
// }

export default function App() {
  return (
    <main className="flex-1">
      <HeroSection />
      <GameSection />
    </main>
  );
}
