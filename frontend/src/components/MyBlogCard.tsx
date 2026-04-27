import React, { createContext, useContext } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export interface MyBlog {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isDeleted: boolean;
}

interface MyBlogCardContextProps {
  blog: MyBlog;
}

const MyBlogCardContext = createContext<MyBlogCardContextProps | undefined>(
  undefined,
);

function useMyBlogCardContext() {
  const context = useContext(MyBlogCardContext);
  if (!context)
    throw new Error(
      "MyBlogCard components must be used within MyBlogCard.Root",
    );
  return context;
}

const formatDate = (date: string | Date) =>
  new Date(date)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();

export function MyBlogCardRoot({
  blog,
  rotationClass,
  children,
}: {
  blog: MyBlog;
  rotationClass?: string;
  children: React.ReactNode;
}) {
  return (
    <MyBlogCardContext.Provider value={{ blog }}>
      <article
        className={cn(
          "relative group transition-transform duration-300 h-min w-full",
          rotationClass,
        )}
        aria-labelledby={`blog-title-${blog.id}`}
      >
        <div className="absolute -right-4 -bottom-4 w-full h-full hatch-shadow -z-10"></div>
        <div className="bg-[#FDFCF0] p-8 sketchy-border relative flex flex-col w-full">
          {children}
        </div>
      </article>
    </MyBlogCardContext.Provider>
  );
}

export function MyBlogCardTitle() {
  const { blog } = useMyBlogCardContext();
  return (
    <h3
      id={`blog-title-${blog.id}`}
      className="font-serif italic text-2xl text-slate-900 leading-tight mb-4"
    >
      {blog.title}
    </h3>
  );
}

export function MyBlogCardContent() {
  const { blog } = useMyBlogCardContext();
  return (
    <p className="font-typewriter text-sm text-slate-700 leading-relaxed mb-6 line-clamp-3">
      {blog.content}
    </p>
  );
}

export function MyBlogCardCreatedAt() {
  const { blog } = useMyBlogCardContext();
  return (
    <div className="mt-auto opacity-60 font-typewriter text-[10px] uppercase">
      Created: {formatDate(blog.createdAt)}
    </div>
  );
}

export function MyBlogCardUpdatedAt() {
  const { blog } = useMyBlogCardContext();
  return (
    <div className="opacity-60 font-typewriter text-[10px] uppercase">
      Updated: {formatDate(blog.updatedAt)}
    </div>
  );
}

export function MyBlogCardMetadata() {
  return (
    <div className="mt-auto space-y-1">
      <MyBlogCardCreatedAt />
      <MyBlogCardUpdatedAt />
    </div>
  );
}

export function MyBlogCardStatus() {
  const { blog } = useMyBlogCardContext();
  if (!blog.isDeleted) return null;
  return (
    <span className="absolute top-4 right-4 bg-destructive/10 text-destructive border border-destructive px-2 py-1 font-typewriter text-[10px] uppercase rotate-12">
      Deleted
    </span>
  );
}

export function MyBlogCardActions() {
  const { blog } = useMyBlogCardContext();
  return (
    <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center w-full">
      <Link
        to="/my-desk/blog/$blogId"
        params={{ blogId: blog.id }}
        className="font-typewriter text-xs underline decoration-wavy hover:text-primary transition-colors"
      >
        Edit Manuscript
      </Link>
      <span
        className="material-symbols-outlined text-slate-400"
        data-icon="edit_note"
        aria-hidden="true"
      >
        edit_note
      </span>
    </div>
  );
}

export const MyBlogCard = Object.assign(MyBlogCardRoot, {
  Title: MyBlogCardTitle,
  Content: MyBlogCardContent,
  CreatedAt: MyBlogCardCreatedAt,
  UpdatedAt: MyBlogCardUpdatedAt,
  Metadata: MyBlogCardMetadata,
  Status: MyBlogCardStatus,
  Actions: MyBlogCardActions,
  Skeleton: MyBlogCardSkeleton,
});

interface MyBlogCardSkeletonProps {
  rotationClass?: string;
}

export function MyBlogCardSkeleton({ rotationClass }: MyBlogCardSkeletonProps) {
  return (
    <article className={cn("relative h-min w-full", rotationClass)}>
      {/* Background Shadow matches MyBlogCardRoot */}
      <div className="absolute -right-4 -bottom-4 w-full h-full hatch-shadow -z-10"></div>

      <div className="bg-[#FDFCF0] p-8 sketchy-border relative flex flex-col w-full animate-pulse">
        {/* Title: matches text-2xl (~32px leading) + mb-4 */}
        <div className="h-7 bg-slate-200 w-3/4 mb-4 rounded-sm"></div>

        {/* Content: matches text-sm + leading-relaxed + mb-6 + line-clamp-3 */}
        <div className="space-y-3 mb-6">
          <div className="h-3.5 bg-slate-200/60 w-full rounded-sm"></div>
          <div className="h-3.5 bg-slate-200/60 w-full rounded-sm"></div>
          <div className="h-3.5 bg-slate-200/60 w-4/5 rounded-sm"></div>
        </div>

        {/* Metadata: matches mt-auto + space-y-1 + text-[10px] */}
        <div className="mt-auto space-y-1.5">
          <div className="h-2.5 bg-slate-200/40 w-24 rounded-sm"></div>
          <div className="h-2.5 bg-slate-200/40 w-32 rounded-sm"></div>
        </div>

        {/* Actions: matches mt-4 + pt-4 + border-t */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center w-full">
          {/* Edit Manuscript Link placeholder */}
          <div className="h-3 bg-slate-200/50 w-28 rounded-sm"></div>
          {/* Material Icon placeholder */}
          <div className="h-6 w-6 bg-slate-200/50 rounded-sm"></div>
        </div>
      </div>
    </article>
  );
}