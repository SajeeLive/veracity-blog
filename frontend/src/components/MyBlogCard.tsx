import React, { createContext, useContext } from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

interface MyBlog {
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

const MyBlogCardContext = createContext<MyBlogCardContextProps | undefined>(undefined);

function useMyBlogCardContext() {
  const context = useContext(MyBlogCardContext);
  if (!context) throw new Error('MyBlogCard components must be used within MyBlogCard.Root');
  return context;
}

export function MyBlogCardRoot({ blog, rotationClass, children }: { blog: MyBlog; rotationClass?: string; children: React.ReactNode }) {
  return (
    <MyBlogCardContext.Provider value={{ blog }}>
      <article className={cn("relative group transition-transform duration-300", rotationClass)}>
        <div className="absolute -right-4 -bottom-4 w-full h-full cross-hatch -z-10"></div>
        <div className="bg-[#FDFCF0] p-8 border-[3px] border-slate-800 shadow-sm relative flex flex-col h-full">
          {children}
        </div>
      </article>
    </MyBlogCardContext.Provider>
  );
}

export function MyBlogCardTitle() {
  const { blog } = useMyBlogCardContext();
  return <h3 className="font-serif italic text-2xl text-slate-900 leading-tight mb-4">{blog.title}</h3>;
}

export function MyBlogCardContent() {
  const { blog } = useMyBlogCardContext();
  return <p className="font-mono text-sm text-slate-700 leading-relaxed mb-6 line-clamp-3">{blog.content}</p>;
}

export function MyBlogCardMetadata() {
  const { blog } = useMyBlogCardContext();
  const formatDate = (date: string | Date) => new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  return (
    <div className="mt-auto space-y-1 opacity-60 font-mono text-[10px] uppercase">
      <div>Created: {formatDate(blog.createdAt)}</div>
      <div>Updated: {formatDate(blog.updatedAt)}</div>
    </div>
  );
}

export function MyBlogCardStatus() {
  const { blog } = useMyBlogCardContext();
  if (!blog.isDeleted) return null;
  return <span className="absolute top-4 right-4 bg-error/10 text-error border border-error px-2 py-1 font-mono text-[10px] uppercase rotate-12">Deleted</span>;
}

export function MyBlogCardActions() {
  const { blog } = useMyBlogCardContext();
  return (
    <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
      <Link to="/my-desk/blog/$blogId" params={{ blogId: blog.id }} className="font-mono text-xs underline decoration-wavy hover:text-primary transition-colors">
        Edit Manuscript
      </Link>
      <span className="material-symbols-outlined text-slate-400" data-icon="edit_note">edit_note</span>
    </div>
  );
}

export const MyBlogCard = Object.assign(MyBlogCardRoot, {
  Title: MyBlogCardTitle,
  Content: MyBlogCardContent,
  Metadata: MyBlogCardMetadata,
  Status: MyBlogCardStatus,
  Actions: MyBlogCardActions,
});
