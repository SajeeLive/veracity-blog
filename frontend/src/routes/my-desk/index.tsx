import { createFileRoute } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/my-desk/')({
  component: MyDeskIndex,
})

function MyDeskIndex() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Posts</CardTitle>
          <CardDescription>Published articles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">0</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Drafts</CardTitle>
          <CardDescription>In progress</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">0</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Views</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">0</p>
        </CardContent>
      </Card>
      
      <div className="md:col-span-2 lg:col-span-3">
        <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
        <div className="border rounded-lg p-8 text-center text-muted-foreground border-dashed">
          No posts found. Start writing your first blog post!
        </div>
      </div>
    </div>
  )
}
