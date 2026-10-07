"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 pt-14 pb-11 text-center">
      <h1 className="font-display text-[39px] mb-3">Couldn&rsquo;t load the map</h1>
      <p className="text-[16px] text-text-secondary mb-6 max-w-sm">
        The data didn&rsquo;t come through. It&rsquo;s usually a blip, so try again in a moment.
      </p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="px-4 py-2 rounded-[2px] bg-accent text-white text-[14px] hover:bg-accent-hover transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
