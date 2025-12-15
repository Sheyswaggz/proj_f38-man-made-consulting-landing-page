export default function Home(): JSX.Element {
  return (
    <main id="main-content" className="min-h-screen bg-earth-50">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-earth-950 sm:text-5xl md:text-6xl">
            Welcome to Man Made Consulting
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-earth-700 sm:text-xl">
            Strategic Technology Leadership for Modern Organizations
          </p>
          <div className="rounded-lg bg-earth-100 p-8 shadow-soft">
            <p className="text-earth-800">
              This is a placeholder page to verify the Next.js setup is working
              correctly. The full landing page content will be implemented in
              subsequent tasks.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}