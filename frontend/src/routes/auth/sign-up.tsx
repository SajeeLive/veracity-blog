import { createFileRoute, Link } from '@tanstack/react-router'
import { registerPasskey } from '../../lib/webauthn'
import { useState } from 'react'
import { Button } from '../../components/ui/button'

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUpComponent,
})

function SignUpComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const handle = formData.get('handle') as string;

      if (!handle) throw new Error('Username is required');

      const regResponse = await registerPasskey(handle);
      console.log('Registration successful:', regResponse);
      
      // Note: Verification step will be added once backend is ready
      alert('Passkey created! (Waiting for server verification implementation)');
    } catch (err: any) {
      if (err.name === 'InvalidStateError') {
        setError('This device is already registered.');
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-serif italic">Sign Up</h1>
        <p className="text-muted-foreground font-typewriter">Join the Inkwell community.</p>
      </div>
      
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="handle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Username
          </label>
          <input
            id="handle"
            name="handle"
            type="text"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="johndoe"
          />
        </div>

        {error && (
          <div className="text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Passkey...' : 'Sign Up with Passkey'}
        </Button>
      </form>

      <div className="text-center text-sm font-mono">
        Already have an account?{' '}
        <Link to="/auth/sign-in" className="text-primary underline-offset-4 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  )
}
