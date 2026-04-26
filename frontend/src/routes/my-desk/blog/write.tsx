import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/my-desk/blog/write')({
  component: WriteBlogPost,
})

function WriteBlogPost() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h2 className="text-2xl font-semibold">Create New Blog Post</h2>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter post title..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="content" className="text-sm font-medium">Content</label>
          <textarea
            id="content"
            rows={10}
            placeholder="Write your post content here (Markdown supported)..."
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button>Publish Post</Button>
        </div>
      </div>
    </div>
  )
}
