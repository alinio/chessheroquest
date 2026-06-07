import { BlogHeader } from "@/src/features/blog/components/BlogHeader";
import { Footer } from "@/src/features/landing/sections/Footer";
import { ExitIntentModal } from "@/src/features/marketing/ExitIntentModal";

/** Shared chrome for every blog page (heroic header + the landing footer). */
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-abyss">
      <BlogHeader />
      <main className="relative flex-1">{children}</main>
      <Footer />
      <ExitIntentModal />
    </div>
  );
}
