import { getPosts } from '@/lib/blog';
import CityExperience from './city-experience';

export default function CityHome() {
  // Only what the news stand shows: keeps post bodies out of the client bundle.
  const posts = getPosts().map(({ slug, eyebrow, title, href }) => ({ slug, eyebrow, title, href }));
  return <CityExperience posts={posts} />;
}
