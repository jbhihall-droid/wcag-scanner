import { ResultsClient } from "@/components/results-client";

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const { url } = await searchParams;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(180deg,_#020617,_#111827)]">
      {url ? (
        <ResultsClient url={url} />
      ) : (
        <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 text-white">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h1 className="text-2xl font-semibold">No URL provided</h1>
            <p className="mt-3 text-slate-300">Go back and enter a site URL to run the first accessibility scan.</p>
          </div>
        </div>
      )}
    </main>
  );
}
