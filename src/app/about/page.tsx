import type { Metadata } from "next";
import { Manifesto } from "@/components/manifesto";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <Manifesto />
      <Footer />
    </>
  );
}
