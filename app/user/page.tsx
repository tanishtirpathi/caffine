"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserProfile = {
  id: string;
  name: string;
  loginId: string;
  mobileNo: string;
  role: string;
};

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/me", { method: "GET" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user data");
        }

        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
      router.push("/auth/login");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-6 py-12 text-[#171A2B]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-black/55">
              Student dashboard
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              {loading ? "Loading..." : `Welcome back, ${user?.name ?? "Student"}`}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
          >
            Logout
          </button>
        </div>

        <div className="mb-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">My details</h2>
          {loading ? (
            <p className="mt-4 text-sm text-black/60">Fetching profile...</p>
          ) : user ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">Name</p>
                <p className="mt-2 text-lg font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">Role</p>
                <p className="mt-2 text-lg font-medium capitalize">{user.role}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">Login ID</p>
                <p className="mt-2 text-lg font-medium">{user.loginId}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">Mobile</p>
                <p className="mt-2 text-lg font-medium">{user.mobileNo}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-red-500">Unable to load user details.</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-sm text-black/60">Available venues</p>
            <p className="mt-3 text-3xl font-bold">24</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-sm text-black/60">My bookings</p>
            <p className="mt-3 text-3xl font-bold">06</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-sm text-black/60">Pending requests</p>
            <p className="mt-3 text-3xl font-bold">02</p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/venue" className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white hover:bg-black/85">
              Browse venues
            </Link>
            <Link href="/booking" className="rounded-xl border border-black/10 bg-[#f7f7f5] px-5 py-3 text-sm font-medium text-black hover:bg-black/5">
              My bookings
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
