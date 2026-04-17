import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemberProfileLayout } from "@/components/member-profile-layout";
import { getMemberProfileBySlug, getMemberStaticParams } from "@/lib/members";
import { pageMetadata } from "@/lib/seo";
import { useMDXComponents } from "../../../../mdx-components";

type MemberProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getMemberStaticParams();
}

export async function generateMetadata({
  params,
}: MemberProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await getMemberProfileBySlug(slug);

  if (!member) {
    return {};
  }

  return pageMetadata({
    title: `${member.meta.displayName} — ${member.meta.role}`,
    description: `${member.meta.displayName} (${member.meta.name}) • ${member.meta.role} at Haltman.IO.`,
    path: `/members/${member.meta.slug}`,
    type: "profile",
    image: member.meta.avatar,
    imageAlt: `${member.meta.displayName} — Haltman.IO`,
  });
}

export default async function MemberProfilePage({
  params,
}: MemberProfilePageProps) {
  const { slug } = await params;
  const member = await getMemberProfileBySlug(slug);

  if (!member) {
    notFound();
  }

  const Content = member.Content;

  return (
    <MemberProfileLayout meta={member.meta}>
      <Content components={useMDXComponents()} />
    </MemberProfileLayout>
  );
}
