import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Effects from "@/components/Effects";

export default function BlogChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fx-grain" aria-hidden />
      <div className="fx-scan" aria-hidden />
      <div className="cursor-glow" aria-hidden />
      <Header />
      <main>{children}</main>
      <Footer />
      <Effects />
    </>
  );
}
