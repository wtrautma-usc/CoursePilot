// import GoogleSignInButton from "@/components/GoogleSignInBtn";

// export default function Home() {
//   return (
//     <main className="flex min-h-screen items-center justify-center bg-black">
//       <GoogleSignInButton />
//     </main>
//   );
// }

import Link from "next/link";

export default function Home() {
  return (
    <main style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div style={{ display: "grid", gap: 12 }}>
        <button>Sign in with Google</button>

        <Link href="/calendar">Go to calendar (test)</Link>
      </div>
    </main>
  );
}