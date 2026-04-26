import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <Outlet />
        </CardContent>
      </Card>
    </div>
  )
}
