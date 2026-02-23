import type { Metadata } from "next";
import { ArtStrip } from "@/components/art-strip";
import { Footer } from "@/components/footer";
import { HyperText } from "@/components/ui/hyper-text";

export const metadata: Metadata = {
  title: "Arts",
};

export default function ArtsPage() {
  return (
    <div className="space-y-8">
      <section className="panel mt-10 rounded-lg p-6 sm:p-8 lg:p-10">
        <p className="label-xs">Visual Archive</p>

        <HyperText
          duration={600}
          className="font-display mt-3 text-3xl font-bold uppercase tracking-[0.06em] text-white sm:text-4xl xl:text-5xl"
        >
          ARTS
        </HyperText>

        <div className="mt-3 h-px w-32 bg-gradient-to-r from-[var(--red)] to-transparent" />

        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted-foreground)]">
          Haltman.io approved artifacts and media archive.
        </p>
      </section>

      <ArtStrip showTopNav={false} layout="grid" />
      <Footer />
    </div>
  );
}
