import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/ui/button'

const signInSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/auth/sign-in')({
  validateSearch: (search) => signInSearchSchema.parse(search),
  component: SignInComponent,
})

function SignInComponent() {
  const { redirect } = Route.useSearch()
  const navigate = useNavigate()
  const login = useAppStore((state) => state.login)

  const handleSignIn = () => {
    login()
    // Using any as a workaround for potential type issues with 'to' before routes are generated
    navigate({ to: (redirect || '/my-desk') as any })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-serif italic">Sign In</h1>
        <p className="text-muted-foreground font-typewriter">Enter your credentials to access your desk.</p>
      </div>
      <div className="space-y-4">
        {/* Mock form */}
        <div className="space-y-2">
          <label className="text-sm font-medium font-mono">Email</label>
          <input 
            type="email" 
            placeholder="inkwell@example.com" 
            className="w-full p-2 bg-transparent sketchy-border focus:outline-none font-mono"
            disabled
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium font-mono">Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="w-full p-2 bg-transparent sketchy-border focus:outline-none font-mono"
            disabled
          />
        </div>
        <Button onClick={handleSignIn} className="w-full">
          Sign In
        </Button>
      </div>
      <div className="text-center text-sm font-mono">
        Don't have an account?{' '}
        <Button variant="link" className="p-0 h-auto" onClick={() => navigate({ to: '/auth/sign-up' as any })}>
          Sign Up
        </Button>
      </div>
    </div>
  )
}
