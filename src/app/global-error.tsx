"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-cream-50 font-sans text-navy-900 antialiased">
        <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Beklenmeyen bir hata oluştu</h1>
          <p className="mt-4 text-sm text-navy-700/80">
            Uygulama geçici olarak yanıt veremiyor. Lütfen sayfayı yenileyin.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-8 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white"
          >
            Tekrar dene
          </button>
          {process.env.NODE_ENV === "development" && (
            <pre className="mt-6 max-w-full overflow-auto rounded-lg bg-navy-900/5 p-4 text-left text-xs">
              {error.message}
            </pre>
          )}
        </div>
      </body>
    </html>
  );
}
