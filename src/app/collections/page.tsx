import type { Metadata } from "next";
import { CollectionsArchive } from "@/components/collections-archive";
import { Footer } from "@/components/footer";
import { HyperText } from "@/components/ui/hyper-text";

export const metadata: Metadata = {
  title: "Collections",
};

export default function CollectionsPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-4 sm:px-8 sm:pt-40 lg:px-12">
        <p className="label-xs">Curated Archive</p>

        <HyperText
          duration={600}
          className="font-display mt-4 text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] font-bold uppercase tracking-[0.03em] text-white"
        >
          COLLECTIONS
        </HyperText>

        <div className="mt-6 h-px w-20 bg-gradient-to-r from-[var(--red)] to-transparent" />

        <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
          Tools, resources, references, and culture trusted by
          Haltman.IO. Filtered, tagged, and annotated by the crew.
        </p>
      </div>

      <div className="mt-8">
        <CollectionsArchive />
      </div>
      <Footer />
    </>
  );
}
