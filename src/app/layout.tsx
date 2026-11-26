import type { Metadata } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import AnalyticsEvents from '@/components/AnalyticsEvents';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { publicAsset } from '@statoz/design-system/asset';
import './globals.css';
const displayFont = localFont({src:'../../public/assets/fonts/orbitron-latin-variable.woff2',variable:'--font-disp',display:'swap',weight:'400 900'});
const bodyFont = localFont({src:'../../public/assets/fonts/space-grotesk-variable.woff2',variable:'--font-ui',display:'swap',weight:'300 700'});
const title = 'StatOz — Your daily home for sport';
const description = 'Your daily home for sport. Explore StatOz City: discover basketball, cricket, football and racing, follow Sports, play Games, and visit the StatOz newsroom.';
export const metadata: Metadata = {
  metadataBase:new URL(SITE_URL),title:{default:title,template:'%s | StatOz'},description,applicationName:SITE_NAME,
  alternates:{canonical:'/'},icons:{icon:publicAsset('/favicon.ico'),apple:publicAsset('/icon-192.png')},
  openGraph:{type:'website',url:SITE_URL,siteName:SITE_NAME,title,description,images:[{url:'/assets/city/city-social.jpg',width:1200,height:630,alt:'StatOz City — Your daily home for sport'}]},
  twitter:{card:'summary_large_image',title,description,images:['/assets/city/city-social.jpg']},
};
const schema = {'@context':'https://schema.org','@type':'WebSite',name:SITE_NAME,url:SITE_URL,description};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && <><Script src="https://www.googletagmanager.com/gtag/js?id=G-7KH0GEDEFX" strategy="afterInteractive" /><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-7KH0GEDEFX');`}</Script></>}
    <AnalyticsEvents />{children}
  </body></html>;
}
