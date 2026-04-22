import { Children, cloneElement, isValidElement } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { cn } from "@/lib/utils";

const mdxImageFrameClassName =
  "border border-(--red-border) bg-[#080808] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_18px_40px_rgba(0,0,0,0.38)]";

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join(" ");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }

  return "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function createHeading(
  Tag: "h2" | "h3" | "h4",
  baseClassName: string,
) {
  return function Heading({
    id,
    className,
    children,
    ...props
  }: ComponentPropsWithoutRef<typeof Tag>) {
    const resolvedId = id ?? slugify(extractText(children));

    return (
      <Tag
        id={resolvedId}
        className={cn(baseClassName, className)}
        {...props}
      >
        {children}
      </Tag>
    );
  };
}

const paragraphClassName =
  "mb-6 text-[1rem] leading-8 text-[var(--muted-foreground)] sm:text-[1.03rem]";

type ContentImageProps = ComponentPropsWithoutRef<"img">;

type PostImageProps = ContentImageProps & {
  caption?: ReactNode;
};

export function ContentImage({
  className,
  alt = "",
  loading = "lazy",
  decoding = "async",
  ...props
}: ContentImageProps) {
  return (
    <img
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={cn("h-auto max-w-full", className)}
      {...props}
    />
  );
}

export function PostImage({ caption, className, ...props }: PostImageProps) {
  const visibleCaption = caption ?? props.alt;

  return (
    <figure className="my-10">
      <ContentImage
        className={cn("block w-full", mdxImageFrameClassName, className)}
        {...props}
      />
      {visibleCaption ? (
        <figcaption className="mx-auto mt-3 max-w-176 text-center text-[0.92rem] leading-6 italic text-muted-foreground sm:text-[0.97rem]">
          {visibleCaption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Paragraph({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  const normalizedChildren = Children.toArray(children).filter((child) => {
    return !(typeof child === "string" && child.trim().length === 0);
  });

  if (normalizedChildren.length === 1) {
    const [child] = normalizedChildren;

    // MDX turns multiline <p> blocks into an outer paragraph wrapping an inner
    // markdown paragraph. Flatten it so we don't emit invalid nested <p> tags.
    if (
      isValidElement<ComponentPropsWithoutRef<"p">>(child) &&
      (child.type === "p" || child.type === Paragraph)
    ) {
      return cloneElement(child, {
        ...props,
        ...child.props,
        className: cn(className, child.props.className),
      });
    }

    if (
      isValidElement<{ className?: string }>(child) &&
      (child.type === "img" || child.type === ContentImage)
    ) {
      return cloneElement(child, {
        ...child.props,
        className: cn(
          "my-10 block w-full",
          mdxImageFrameClassName,
          className,
          child.props.className,
        ),
      });
    }
  }

  return (
    <p className={cn(paragraphClassName, className)} {...props}>
      {children}
    </p>
  );
}

function Table({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-10 overflow-x-auto border border-(--red-border) bg-[#080808] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_18px_40px_rgba(0,0,0,0.32)]">
      <table
        className={cn(
          "min-w-full border-collapse text-left text-[0.95rem] leading-7 text-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

const components: MDXComponents = {
  h2: createHeading(
    "h2",
    "font-display mt-12 mb-4 text-[1.65rem] font-bold uppercase leading-[1.08] tracking-[0.03em] text-white sm:text-[1.95rem]",
  ),
  h3: createHeading(
    "h3",
    "font-display mt-10 mb-4 text-[1.2rem] font-bold uppercase leading-[1.15] tracking-[0.03em] text-white sm:text-[1.45rem]",
  ),
  h4: createHeading(
    "h4",
    "font-display mt-8 mb-3 text-[1.05rem] font-bold uppercase leading-[1.2] tracking-[0.03em] text-white",
  ),
  p: Paragraph,
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "mb-8 list-disc space-y-3 pl-6 text-[1rem] leading-8 text-[var(--muted-foreground)] marker:text-[var(--red)] sm:text-[1.03rem]",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "mb-8 list-decimal space-y-3 pl-6 text-[1rem] leading-8 text-[var(--muted-foreground)] marker:font-mono marker:text-[var(--red)] sm:text-[1.03rem]",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("pl-1 leading-7", className)} {...props} />
  ),
  a: ({ className, ...props }) => (
    <a className={cn("accent-link", className)} {...props} />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn("font-semibold text-white", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "mb-8 border-l-2 border-[var(--red)] bg-[rgba(255,42,42,0.05)] px-5 py-4 text-[1rem] leading-8 text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:text-[1.03rem]",
        className,
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr
      className={cn("my-10 border-0 border-t border-[var(--red-border)]", className)}
      {...props}
    />
  ),
  table: Table,
  thead: ({ className, ...props }) => (
    <thead
      className={cn(
        "border-b border-(--red-border) bg-[rgba(255,42,42,0.08)] text-white",
        className,
      )}
      {...props}
    />
  ),
  tbody: ({ className, ...props }) => (
    <tbody className={cn("[&_tr:last-child]:border-b-0", className)} {...props} />
  ),
  tr: ({ className, ...props }) => (
    <tr
      className={cn(
        "border-b border-[rgba(255,42,42,0.14)] align-top transition-colors hover:bg-[rgba(255,255,255,0.015)]",
        className,
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "px-4 py-3 font-mono text-[0.72rem] font-semibold tracking-[0.12em] text-(--red) sm:px-5",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "px-4 py-3 align-top text-[0.95rem] leading-7 text-muted-foreground sm:px-5",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "mb-8 overflow-x-auto border border-[var(--red-border)] bg-[#080808] px-4 py-4 font-mono text-sm text-[#f4d7d7] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }) => {
    const isBlockCode = Boolean(className?.includes("language-"));

    return (
      <code
        className={cn(
          isBlockCode
            ? "font-mono text-[13px] text-[#f4d7d7]"
            : "border border-[var(--red-border)] bg-[rgba(255,42,42,0.08)] px-1.5 py-0.5 font-mono text-[0.9em] text-[#ffe1e1]",
          className,
        )}
        {...props}
      />
    );
  },
  img: ContentImage,
  PostImage,
};

export function useMDXComponents(
  overrides: MDXComponents = {},
): MDXComponents {
  return {
    ...components,
    ...overrides,
  };
}
