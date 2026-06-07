import type { Metadata } from "next";

// Auth page — give it a real title but keep it out of the index.
export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: true },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
