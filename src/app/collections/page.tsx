import type { Metadata } from "next";
import { CollectionGrid } from "@/components/collection-grid";
import { Footer } from "@/components/footer";
import { HyperText } from "@/components/ui/hyper-text";

export const metadata: Metadata = {
  title: "Collections",
};

export default function CollectionsPage() {
  return (
    <div className="space-y-8">
      <section className="panel rounded-lg p-6 sm:p-8 lg:p-10 mt-10">
        <p className="label-xs">Curated Links</p>

        <HyperText
          duration={600}
          className="font-display mt-3 text-3xl font-bold uppercase tracking-[0.06em] text-white sm:text-4xl xl:text-5xl"
        >
          COLLECTIONS
        </HyperText>

        <div className="mt-3 h-px w-32 bg-gradient-to-r from-[var(--red)] to-transparent" />

        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted-foreground)]">
          Tools, resources and references trusted and recommended by Haltman.io.
        </p>
      </section>

      <CollectionGrid />
      <Footer />
    </div>
  );
}
