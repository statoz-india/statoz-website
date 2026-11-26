import JsonLd from '@/components/JsonLd';
import { getPosts } from '@/lib/blog';
import { faqJsonLd } from '@/lib/structuredData';
import CityExperience from './city-experience';
import { homeFaq } from './content';

export default function CityHome() {
  // Only what the news stand shows: keeps post bodies out of the client bundle.
  const posts = getPosts().map(({ slug, eyebrow, title, href }) => ({ slug, eyebrow, title, href }));
  return <>
    {/* FAQPage schema for the questions the homepage shows. */}
    <JsonLd data={faqJsonLd(homeFaq.map(item => ({ q: item.question, a: item.answer })))} />
    <CityExperience posts={posts} />
  </>;
}
