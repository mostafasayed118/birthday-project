"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center space-y-4 px-4">
            <p className="text-sm font-medium text-destructive tracking-wide uppercase">
              Error
            </p>
            <h1 className="text-4xl font-bold text-foreground">
              Something went wrong
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              {error.message || "An unexpected error occurred. Please try again."}
            </p>
            <button
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
