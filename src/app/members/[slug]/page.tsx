import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemberProfileLayout } from "@/components/member-profile-layout";
import { getMemberProfileBySlug, getMemberStaticParams } from "@/lib/members";
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

  return {
    title: `${member.meta.displayName} | Members`,
    description: `${member.meta.displayName} (${member.meta.name}) • ${member.meta.role}`,
  };
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
