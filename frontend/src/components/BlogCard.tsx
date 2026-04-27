import React, { createContext, useContext } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  user: {
    handle: string;
  };
}

interface BlogCardContextProps {
  post: BlogPost;
  rotationClass?: string;
}

const BlogCardContext = createContext<BlogCardContextProps | undefined>(undefined);

function useBlogCardContext() {
  const context = useContext(BlogCardContext);
  if (!context) {
    throw new Error('BlogCard compound components must be used within a BlogCardRoot');
  }
  return context;
}

export interface BlogCardRootProps {
  post: BlogPost;
  rotationClass?: string;
  children: React.ReactNode;
}

export function BlogCardRoot({ post, rotationClass, children }: BlogCardRootProps) {
  return (
    <BlogCardContext.Provider value={{ post, rotationClass }}>
      <article className={`relative ${rotationClass || ''}`}>
        <div className="absolute inset-0 translate-x-3 translate-y-3 hatch-shadow group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-200"></div>
        <div className="relative bg-white p-8 torn-edge sketchy-border min-h-[400px] flex flex-col">
          {children}
        </div>
      </article>
    </BlogCardContext.Provider>
  );
}

export function BlogCardTitle() {
  const { post } = useBlogCardContext();
  return (
    <header className="mb-6">
      <h3 className="font-typewriter font-bold text-2xl text-[#202f38] leading-tight">
        {post.title}
      </h3>
      <div className="w-full h-px bg-[#36454f33] mt-2"></div>
    </header>
  );
}

export function BlogCardContent() {
  const { post } = useBlogCardContext();
  return (
    <div className="flex-grow">
      <p className="font-typewriter text-[#43474b] line-clamp-6 leading-relaxed">
        {post.content.substring(0, 150)}...
      </p>
    </div>
  );
}

export function BlogCardFooter({ children }: { children: React.ReactNode }) {
  return (
    <footer className="mt-8 pt-4 border-t border-dashed border-[#36454f33] flex justify-between items-end font-typewriter text-xs">
      {children}
    </footer>
  );
}

export function BlogCardAuthor() {
  const { post } = useBlogCardContext();
  return <span className="font-bold">Author: {post.user.handle}</span>;
}

export function BlogCardCreatedAt() {
  const { post } = useBlogCardContext();
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
  return <span className="opacity-60 italic">{formattedDate}</span>;
}

// Dedicated Component
export interface BlogCardProps {
  post: BlogPost;
  rotationClass?: string;
}

export function BlogCard({ post, rotationClass }: BlogCardProps) {
  return (
    <BlogCardRoot post={post} rotationClass={rotationClass}>
      <BlogCardTitle />
      <BlogCardContent />
      <BlogCardFooter>
        <BlogCardAuthor />
        <BlogCardCreatedAt />
      </BlogCardFooter>
    </BlogCardRoot>
  );
}

// Attach compounds to the dedicated component for property access
BlogCard.Root = BlogCardRoot;
BlogCard.Title = BlogCardTitle;
BlogCard.Content = BlogCardContent;
BlogCard.Footer = BlogCardFooter;
BlogCard.Author = BlogCardAuthor;
BlogCard.CreatedAt = BlogCardCreatedAt;

export function BlogCardSkeleton({ rotationClass }: { rotationClass?: string }) {
  return (
    <div className={`relative ${rotationClass || ''}`}>
      <div className="absolute inset-0 translate-x-3 translate-y-3 hatch-shadow"></div>
      <div className="relative bg-white p-8 torn-edge sketchy-border min-h-[400px] flex flex-col animate-pulse">
        <header className="mb-6">
          <div className="h-8 bg-primary/10 w-3/4 mb-2"></div>
          <div className="w-full h-px bg-[#36454f33] mt-2"></div>
        </header>
        <div className="flex-grow space-y-3">
          <div className="h-4 bg-primary/5 w-full"></div>
          <div className="h-4 bg-primary/5 w-full"></div>
          <div className="h-4 bg-primary/5 w-5/6"></div>
          <div className="h-4 bg-primary/5 w-full"></div>
          <div className="h-4 bg-primary/5 w-4/5"></div>
        </div>
        <footer className="mt-8 pt-4 border-t border-dashed border-[#36454f33] flex justify-between items-end">
          <div className="h-3 bg-primary/10 w-24"></div>
          <div className="h-3 bg-primary/10 w-20"></div>
        </footer>
      </div>
    </div>
  );
}
