import type { Metadata } from "next";
import { ArtStrip } from "@/components/art-strip";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { ProjectGrid } from "@/components/project-grid";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Hero />
      <ProjectGrid />
      <ArtStrip />
      <Footer />
    </div>
  );
}
