export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f3f4f6,transparent_55%),linear-gradient(180deg,#ffffff,#f8fafc)] px-6">
      <section className="w-full max-w-md rounded-3xl border border-black/10 bg-white/85 p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
          Flow Sprint Clock
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          Focus timer scaffold
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The app shell is ready. Product behavior will be added in the next
          task.
        </p>
      </section>
    </main>
  );
}
