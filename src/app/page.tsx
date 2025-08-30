import { Hero } from '@/components/home/hero';
import { FeaturedProperties } from '@/components/home/featured-properties';
import { WhyChooseUs } from '@/components/home/why-choose-us';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <WhyChooseUs />
    </>
  );
}
