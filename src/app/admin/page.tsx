import { cookies } from "next/headers";
import { isValidSessionToken, COOKIE_NAME } from "@/lib/adminAuth";
import { getCitiesWithVisits, getLatestUpdateByVisit, getTrip } from "@/lib/data";
import { pickRepresentativeVisit } from "@/lib/status";
import { LoginForm } from "@/components/Admin/LoginForm";
import { CheckInForm } from "@/components/Admin/CheckInForm";
import { LogoutButton } from "@/components/Admin/LogoutButton";
import { SafeCheckInButton } from "@/components/Admin/SafeCheckInButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authenticated = isValidSessionToken(cookieStore.get(COOKIE_NAME)?.value);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-14 pb-11">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl mb-6 text-center">Admin sign-in</h1>
          <LoginForm />
        </div>
      </div>
    );
  }

  const [cities, latestUpdateByVisit, trip] = await Promise.all([
    getCitiesWithVisits(),
    getLatestUpdateByVisit(),
    getTrip(),
  ]);

  const captionsByCity: Record<string, string> = {};
  for (const city of cities) {
    const visit = pickRepresentativeVisit(city.visits, city.timezone);
    const update = visit ? latestUpdateByVisit[visit.id] : undefined;
    if (update) captionsByCity[city.id] = update.caption;
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 pt-20 pb-24">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl">Post a check-in</h1>
          <LogoutButton />
        </div>

        <SafeCheckInButton initialLastCheckedIn={trip?.last_checked_in ?? null} />

        <div className="mt-8">
          <CheckInForm cities={cities} captionsByCity={captionsByCity} />
        </div>
      </div>
    </div>
  );
}
