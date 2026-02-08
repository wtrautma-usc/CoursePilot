import { title } from "process";
import "./globals.css";

export const metadata = {
  title: "CoursePilot",
  description: "Your AI-powered course companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b p-4 font-semibold">
          CoursePilot
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}