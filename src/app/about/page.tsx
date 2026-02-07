import type { Metadata } from "next";
import { Manifesto } from "@/components/manifesto";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <Manifesto />
      <Footer />
    </div>
  );
}
