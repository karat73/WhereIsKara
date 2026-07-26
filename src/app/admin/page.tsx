import { cookies } from "next/headers";
import { isValidSessionToken, COOKIE_NAME } from "@/lib/adminAuth";
import { getCities } from "@/lib/data";
import { LoginForm } from "@/components/Admin/LoginForm";
import { CheckInForm } from "@/components/Admin/CheckInForm";
import { LogoutButton } from "@/components/Admin/LogoutButton";

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

  const cities = await getCities();

  return (
    <div className="min-h-screen px-4 sm:px-6 pt-20 pb-24">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl">Post a check-in</h1>
          <LogoutButton />
        </div>
        <CheckInForm cities={cities} />
      </div>
    </div>
  );
}
