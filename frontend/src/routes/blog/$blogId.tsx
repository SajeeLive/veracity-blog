import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { BlogDetailsCard } from '@/components/BlogDetailsCard'
import { Button } from '@/components/ui/button'

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
    return <BlogDetailsCard.Skeleton />
  }

  if (error || !post) {
    return <div className="text-center font-typewriter text-red-600">Error: Could not retrieve the dispatch.</div>
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 md:px-0">
      <div className="mb-8">
        <Link to="/">
          <Button variant="outline" className="font-typewriter flex items-center gap-2">
            <span className="material-symbols-outlined text-sm" data-icon="arrow_back">arrow_back</span>
            Back to Listing
          </Button>
        </Link>
      </div>
      <BlogDetailsCard post={post} />
    </div>
  )
}

