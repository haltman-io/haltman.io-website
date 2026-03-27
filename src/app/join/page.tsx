import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { JoinHub } from "@/components/join-hub";
import { HyperText } from "@/components/ui/hyper-text";

export const metadata: Metadata = {
  title: "Join",
};

export default function JoinPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-4 sm:px-8 sm:pt-40 lg:px-12">
        <p className="label-xs">Entry Point</p>

        <HyperText
          duration={600}
          className="font-display mt-4 text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] font-bold uppercase tracking-[0.03em] text-white"
        >
          JOIN US
        </HyperText>

        <div className="mt-6 h-px w-20 bg-gradient-to-r from-[var(--red)] to-transparent" />
      </div>

      <div className="mt-12">
        <JoinHub />
      </div>
      <Footer />
    </>
  );
}
