"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

type Props = {
  initialLastCheckedIn: string | null;
};

export function SafeCheckInButton({ initialLastCheckedIn }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [lastCheckedIn, setLastCheckedIn] = useState(initialLastCheckedIn);
  const router = useRouter();

  async function handleClick() {
    setState("loading");
    const res = await fetch("/api/checkin", { method: "POST" });
    if (!res.ok) {
      setState("idle");
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (data.last_checked_in) setLastCheckedIn(data.last_checked_in);
    setState("done");
    router.refresh(); // re-renders the (server-side) Header so it picks up the new timestamp
    window.setTimeout(() => setState("idle"), 2000);
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={state === "loading"}
        className="w-full rounded-[2px] bg-accent hover:bg-accent-hover active:bg-accent-hover disabled:opacity-60 text-white font-medium text-[16px] py-3 transition-colors"
      >
        {state === "done" ? "Checked in" : state === "loading" ? "Checking in…" : "I'm safe"}
      </button>
      {lastCheckedIn && (
        <p className="mt-2 text-[13px] text-text-secondary text-center">
          Last checked in {formatDistanceToNow(new Date(lastCheckedIn), { addSuffix: true })}
        </p>
      )}
    </div>
  );
}
