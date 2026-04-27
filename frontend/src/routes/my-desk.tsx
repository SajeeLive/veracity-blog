import { createFileRoute, Outlet, Link, redirect } from '@tanstack/react-router'
import { useAppStore } from '@/store/appStore'

export const Route = createFileRoute('/my-desk')({
  beforeLoad: ({ location }) => {
    const { isAuthenticated } = useAppStore.getState();
    if (!isAuthenticated) {
      throw redirect({
        to: '/auth/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: MyDeskLayout,
})

function MyDeskLayout() {
  const { user } = useAppStore();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight">
          {user?.handle ? `${user.handle}'s Desk` : "Author's Desk"}
        </h1>
        <nav className="flex gap-4 border-b border-border pb-4">
          <Link
            to="/my-desk"
            className="text-sm font-medium hover:text-primary transition-colors [&.active]:text-primary [&.active]:border-b-2 [&.active]:border-primary"
            activeOptions={{
              exact: true,
            }}
          >
            Overview
          </Link>
          <Link
            to="/my-desk/blog/write"
            className="text-sm font-medium hover:text-primary transition-colors [&.active]:text-primary [&.active]:border-b-2 [&.active]:border-primary"
          >
            Write New
          </Link>
        </nav>
      </div>
      <Outlet />
    </div>
  )
}
