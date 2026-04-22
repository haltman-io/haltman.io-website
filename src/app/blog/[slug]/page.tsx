import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostLayout } from "@/components/blog-post-layout";
import { createBlogMDXComponents } from "@/lib/blog-mdx-components";
import { getBlogPostBySlug, getBlogStaticParams } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getBlogStaticParams();
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return pageMetadata({
    title: post.meta.title,
    description: post.meta.subtitle,
    path: `/blog/${post.meta.slug}`,
    type: "article",
    publishedTime: post.meta.date,
    authors: [post.meta.author.displayName],
    keywords: post.meta.tags.map((tag) => tag.label),
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const Content = post.Content;

  return (
    <BlogPostLayout meta={post.meta} sourceFilename={post.filename}>
      <Content components={createBlogMDXComponents(post.filename)} />
    </BlogPostLayout>
  );
}
