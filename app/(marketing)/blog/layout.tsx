import { BlogHeader } from "@/src/features/blog/components/BlogHeader";
import { Footer } from "@/src/features/landing/sections/Footer";
import { BackdropAtmosphere } from "@/src/features/landing/components/BackdropAtmosphere";
import { ExitIntentModal } from "@/src/features/marketing/ExitIntentModal";

/** Shared chrome for every blog page (heroic header + the landing footer) over
 *  the same chessboard-watermark atmosphere as the home page. */
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <BackdropAtmosphere />
      <BlogHeader />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
      <ExitIntentModal />
    </div>
  );
}
