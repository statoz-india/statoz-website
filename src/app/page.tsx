import CityHome from '@/features/home/city-home';
import { preload } from 'react-dom';
export default function Home() {
  preload('/statoz-website/assets/city/city-mobile.webp', {as:'image',type:'image/webp',media:'(max-width: 700px)',fetchPriority:'high'});
  preload('/statoz-website/assets/city/city-poster.webp', {as:'image',type:'image/webp',media:'(min-width: 701px)',fetchPriority:'high'});
  return <CityHome />;
}
