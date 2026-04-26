import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUpComponent,
})

function SignUpComponent() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-serif italic">Sign Up</h1>
        <p className="text-muted-foreground font-typewriter">Join the Inkwell community.</p>
      </div>
      <div className="py-8 text-center font-typewriter italic opacity-70">
        Registration is currently restricted to invited scribes.
      </div>
      <div className="text-center text-sm font-mono">
        Already have an account?{' '}
        <Link to="/auth/sign-in" className="text-primary underline-offset-4 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  )
}
