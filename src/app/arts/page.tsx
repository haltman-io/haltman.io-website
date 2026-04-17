import { ArtStrip } from "@/components/art-strip";
import { Footer } from "@/components/footer";
import { HyperText } from "@/components/ui/hyper-text";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Arts",
  description:
    "Visual archive from the Haltman.IO collective. Posters, graphics, and experiments published openly.",
  path: "/arts",
});

export default function ArtsPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-4 sm:px-8 sm:pt-40 lg:px-12">
        <p className="label-xs">Visual Archive</p>

        <HyperText
          duration={600}
          className="font-display mt-4 text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] font-bold uppercase tracking-[0.03em] text-white"
        >
          ARTS
        </HyperText>

        <div className="mt-6 h-px w-20 bg-gradient-to-r from-[var(--red)] to-transparent" />

        <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
          Haltman.IO approved artifacts and media archive.
        </p>
      </div>

      <ArtStrip showTopNav={false} layout="grid" />
      <Footer />
    </>
  );
}
