import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Approach from '@/components/sections/Approach';
import Process from '@/components/sections/Process';
import SocialProof from '@/components/sections/SocialProof';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Problem className="mt-16 md:mt-24" />
      <Approach className="mt-16 md:mt-24" />
      <Process className="mt-16 md:mt-24" />
      <SocialProof className="mt-16 md:mt-24" />
    </main>
  );
}