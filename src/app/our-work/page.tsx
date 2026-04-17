import { Footer } from "@/components/footer";
import { WorkArchive } from "@/components/work-archive";
import { HyperText } from "@/components/ui/hyper-text";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Work",
  description:
    "Public output from the Haltman.IO collective. Infrastructure, free software, and privacy-first services we run and maintain.",
  path: "/our-work",
});

export default function OurWorkPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-4 sm:px-8 sm:pt-40 lg:px-12">
        <p className="label-xs">Public Output</p>

        <HyperText
          duration={600}
          className="font-display mt-4 text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] font-bold uppercase tracking-[0.03em] text-white"
        >
          OUR WORK
        </HyperText>

        <div className="mt-6 h-px w-20 bg-gradient-to-r from-[var(--red)] to-transparent" />

        <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
          Every tool, service, and release published by Haltman.IO.
          Open source. Public by default.
        </p>
      </div>

      <div className="mt-12">
        <WorkArchive />
      </div>
      <Footer />
    </>
  );
}
