import { Footer } from "@/components/footer";
import { JoinHub } from "@/components/join-hub";
import { HyperText } from "@/components/ui/hyper-text";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Join",
  description:
    "We do not recruit — we recognize. How to reach the Haltman.IO collective if your values and work align with ours.",
  path: "/join",
});

export default function JoinPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-4 sm:px-8 sm:pt-40 lg:px-12">
        <p className="label-xs">Official Directory</p>

        <HyperText
          duration={600}
          className="font-display mt-4 text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] font-bold uppercase tracking-[0.03em] text-white"
        >
          JOIN
        </HyperText>

        <div className="mt-6 h-px w-20 bg-gradient-to-r from-[var(--red)] to-transparent" />

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
          Official contact routes, verified social profiles, and public
          references. If you want to reach Haltman.IO or show your work, this
          is the page to start from.
        </p>

        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8f8f8f]">
          No recruiters // no investor funnel // no application form
        </p>
      </div>

      <div className="mt-12">
        <JoinHub />
      </div>
      <Footer />
    </>
  );
}
