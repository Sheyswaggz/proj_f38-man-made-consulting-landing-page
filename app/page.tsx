import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Approach from '@/components/sections/Approach';
import Process from '@/components/sections/Process';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Problem />
      <Approach />
      <Process />
    </main>
  );
}