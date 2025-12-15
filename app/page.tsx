import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Approach from '@/components/sections/Approach';
import Process from '@/components/sections/Process';
import SocialProof from '@/components/sections/SocialProof';
import Team from '@/components/sections/Team';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Problem />
      <Approach />
      <Process />
      <SocialProof />
      <Team />
    </main>
  );
}