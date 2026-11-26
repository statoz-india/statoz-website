import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Effects from "@/components/Effects";
import ReturnToCity from '@/features/home/return-to-city';
import { Suspense } from 'react';
import QueryLayout from './QueryLayout';
import '@/app/legacy-styles.css';

export default function BlogChrome({
  children,
  showLayout = true,
  queryLayout = false,
}: {
  children: React.ReactNode;
  showLayout?: boolean;
  queryLayout?: boolean;
}) {
  const chrome = (content: React.ReactNode) => queryLayout
    ? <Suspense fallback={content}><QueryLayout>{content}</QueryLayout></Suspense>
    : content;
  return (
    <>
      <div className="fx-grain" aria-hidden />
      <div className="fx-scan" aria-hidden />
      <div className="cursor-glow" aria-hidden />
      {showLayout && chrome(<Header />)}
      <main>{children}</main>
      {showLayout && chrome(<><Footer /><ReturnToCity /></>)}
      <Effects />
    </>
  );
}
