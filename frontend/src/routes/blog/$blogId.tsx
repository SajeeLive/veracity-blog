import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { BlogDetailsCard } from '@/components/BlogDetailsCard'

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

  return (
    <BlogDetailsCard post={post} />
  )
}

