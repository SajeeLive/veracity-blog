import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
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
      </div>
      <Outlet />
    </div>
  )
}
