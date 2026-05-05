"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">{error.message}</p>
            <button
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={() => reset()}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
