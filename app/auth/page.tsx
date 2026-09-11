import Link from "next/link";

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-center">
          Campus Reservation
        </h1>

        <p className="mt-2 text-center text-gray-600">
          Choose how you want to continue
        </p>

        <div className="mt-8 space-y-4">
          <Link
            href="/auth/admin/login"
            className="block w-full rounded-lg bg-black px-4 py-3 text-center text-white hover:bg-gray-800"
          >
            Continue as Admin
          </Link>

          <Link
            href="/auth/student/register"
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-center hover:bg-gray-50"
          >
            Continue as Student
          </Link>
        </div>
      </div>
    </main>
  );
}