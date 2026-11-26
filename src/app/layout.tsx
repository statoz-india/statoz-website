import type { Metadata } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import AnalyticsEvents from '@/components/AnalyticsEvents';
import JsonLd from '@/components/JsonLd';
import { SITE_URL, SITE_NAME, SITE_LANGUAGE } from '@/lib/site';
import { SITE_GRAPH } from '@/lib/structuredData';
import { publicAsset } from '@statoz/design-system/asset';
import './globals.css';
const displayFont = localFont({src:'../../public/assets/fonts/orbitron-latin-variable.woff2',variable:'--font-disp',display:'swap',weight:'400 900'});
const bodyFont = localFont({src:'../../public/assets/fonts/space-grotesk-variable.woff2',variable:'--font-ui',display:'swap',weight:'300 700'});
const title = 'StatOz — Your daily home for sport';
const description = 'Your daily home for sport. Explore StatOz City: discover basketball, cricket, football and racing, follow Sports, play Games, and visit the StatOz newsroom.';
export const metadata: Metadata = {
  metadataBase:new URL(SITE_URL),title:{default:title,template:'%s | StatOz'},description,applicationName:SITE_NAME,
  alternates:{canonical:'/',types:{'application/rss+xml':[{url:'/blog/rss.xml',title:`${SITE_NAME} Blog`}]}},
  icons:{icon:publicAsset('/favicon.ico'),apple:publicAsset('/assets/brand/app-icon.png')},
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
  // Smart App Banner: Safari on iPhone and iPad offers the App Store listing.
  itunes:{appId:'6761310455'},
  // Search engine verification, only when the token is set at build time (skip if verified by DNS).
  verification:{
    ...(process.env.GOOGLE_SITE_VERIFICATION && {google:process.env.GOOGLE_SITE_VERIFICATION}),
    ...(process.env.BING_SITE_VERIFICATION && {other:{'msvalidate.01':process.env.BING_SITE_VERIFICATION}}),
  },
  openGraph:{type:'website',url:SITE_URL,siteName:SITE_NAME,locale:'en_IN',title,description,images:[{url:'/assets/city/city-social.jpg',width:1200,height:630,alt:'StatOz City — Your daily home for sport'}]},
  twitter:{card:'summary_large_image',title,description,images:['/assets/city/city-social.jpg']},
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang={SITE_LANGUAGE} className={`${displayFont.variable} ${bodyFont.variable}`}><body>
    {/* Organization, WebSite, MobileApplication and WebApplication, on every page. */}
    <JsonLd data={SITE_GRAPH} />
    {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && <><Script src="https://www.googletagmanager.com/gtag/js?id=G-7KH0GEDEFX" strategy="afterInteractive" /><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-7KH0GEDEFX');`}</Script></>}
    <AnalyticsEvents />{children}
  </body></html>;
}
