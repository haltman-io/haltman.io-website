import { Manifesto } from "@/components/manifesto";
import { Footer } from "@/components/footer";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "The Haltman.IO manifesto. Who we are, what we believe, and why we build. An independent Brazilian hacker collective — assembled by time, not by hype.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Manifesto />
      <Footer />
    </>
  );
}
