import React, { createContext, useContext } from 'react';

interface BlogDetailsCardContextProps {
  post: {
    title: string;
    content: string;
    createdAt: Date | string;
    author: {
      handle: string;
    };
  };
}

const BlogDetailsCardContext = createContext<BlogDetailsCardContextProps | undefined>(undefined);

function useBlogDetailsCardContext() {
  const context = useContext(BlogDetailsCardContext);
  if (!context) {
    throw new Error('BlogDetailsCard compound components must be used within a BlogDetailsCardRoot');
  }
  return context;
}

export interface BlogDetailsCardRootProps {
  post: BlogDetailsCardContextProps['post'];
  children: React.ReactNode;
}

export function BlogDetailsCardRoot({ post, children }: BlogDetailsCardRootProps) {
  return (
    <BlogDetailsCardContext.Provider value={{ post }}>
      <article className="max-w-3xl mx-auto bg-white p-8 md:p-12 torn-edge sketchy-border">
        {children}
      </article>
    </BlogDetailsCardContext.Provider>
  );
}

export function BlogDetailsCardTitle() {
  const { post } = useBlogDetailsCardContext();
  return (
    <h1 className="font-typewriter font-bold text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-[#202f38] mb-6">
      {post.title}
    </h1>
  );
}

export function BlogDetailsCardMeta({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center font-typewriter text-sm border-y border-dashed border-[#36454f33] py-4 mb-10">
      {children}
    </div>
  );
}

export function BlogDetailsCardAuthor() {
  const { post } = useBlogDetailsCardContext();
  return <span className="font-bold text-[#43474b]">By {post.author.handle}</span>;
}

export function BlogDetailsCardCreatedAt() {
  const { post } = useBlogDetailsCardContext();
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
  return <span className="opacity-70 italic">{formattedDate}</span>;
}

export function BlogDetailsCardContent() {
  const { post } = useBlogDetailsCardContext();
  // Filter out the seed-generated footer line if it exists
  const paragraphs = post.content.split('\n')
    .filter(p => !p.includes('Timestamp:') && !p.includes('Unique ID:'))
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <div className="prose prose-lg max-w-none font-typewriter text-[#43474b] leading-relaxed">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-6">{paragraph}</p>
      ))}
    </div>
  );
}

export function BlogDetailsCardSkeleton() {
  return (
    <article className="max-w-3xl mx-auto bg-white p-8 md:p-12 torn-edge sketchy-border animate-pulse">
      <div className="h-12 bg-primary/10 w-3/4 mb-6"></div>
      <div className="flex justify-between items-center border-y border-dashed border-[#36454f33] py-4 mb-10">
        <div className="h-4 bg-primary/10 w-32"></div>
        <div className="h-4 bg-primary/10 w-24"></div>
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-primary/5 w-full"></div>
        <div className="h-4 bg-primary/5 w-full"></div>
        <div className="h-4 bg-primary/5 w-5/6"></div>
        <div className="h-4 bg-primary/5 w-full"></div>
        <div className="h-4 bg-primary/5 w-4/5"></div>
      </div>
    </article>
  );
}

// Dedicated Component
export interface BlogDetailsCardProps {
  post: BlogDetailsCardContextProps['post'];
}

export function BlogDetailsCard({ post }: BlogDetailsCardProps) {
  return (
    <BlogDetailsCardRoot post={post}>
      <BlogDetailsCardTitle />
      <BlogDetailsCardMeta>
        <BlogDetailsCardAuthor />
        <BlogDetailsCardCreatedAt />
      </BlogDetailsCardMeta>
      <BlogDetailsCardContent />
    </BlogDetailsCardRoot>
  );
}

// Attach compounds to the dedicated component
BlogDetailsCard.Root = BlogDetailsCardRoot;
BlogDetailsCard.Title = BlogDetailsCardTitle;
BlogDetailsCard.Meta = BlogDetailsCardMeta;
BlogDetailsCard.Author = BlogDetailsCardAuthor;
BlogDetailsCard.CreatedAt = BlogDetailsCardCreatedAt;
BlogDetailsCard.Content = BlogDetailsCardContent;
BlogDetailsCard.Skeleton = BlogDetailsCardSkeleton;
