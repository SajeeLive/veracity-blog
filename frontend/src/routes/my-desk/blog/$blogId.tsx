import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/my-desk/blog/$blogId')({
  component: AuthorBlogPreview,
})

function AuthorBlogPreview() {
  const { blogId } = Route.useParams()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Previewing Post: {blogId}</h2>
        <div className="flex gap-2">
          <Button variant="outline">Edit Post</Button>
          <Button>Publish Changes</Button>
        </div>
      </div>
      
      <div className="border rounded-lg p-12 bg-card">
        <p className="text-muted-foreground text-center">
          Full blog preview content for post {blogId} will appear here.
        </p>
      </div>
    </div>
  )
}
