import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'

export const Route = createFileRoute('/blog/$blogId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { blogId } = Route.useParams()

  // TODO: preloader  
  const { data: post, isLoading, error } = useQuery(
    trpc.blog.getBlogById.queryOptions({ id: blogId })
  )

  if (isLoading) {
    return <div className="text-center font-typewriter text-lg">Retrieving dispatch from archives...</div>
  }

  if (error || !post) {
    return <div className="text-center font-typewriter text-red-600">Error: Could not retrieve the dispatch.</div>
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();

  return (
    <article className="max-w-3xl mx-auto bg-white p-8 md:p-12 torn-edge sketchy-border">
      <header className="mb-10">
        <h1 className="font-serif text-[40px] md:text-[56px] leading-[1.1] tracking-[-0.02em] text-[#202f38] mb-6">
          {post.title}
        </h1>
        <div className="flex justify-between items-center font-typewriter text-sm border-y border-dashed border-[#36454f33] py-4">
          <span className="font-bold text-[#43474b]">By {post.author.handle}</span>
          <span className="opacity-70 italic">{formattedDate}</span>
        </div>
      </header>

      <div className="prose prose-lg max-w-none font-typewriter text-[#43474b] leading-relaxed">
        {/* For now, just rendering raw content. If markdown, we'd use a parser. */}
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-6">{paragraph}</p>
        ))}
      </div>
    </article>
  )
}
