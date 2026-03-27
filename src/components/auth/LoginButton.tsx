import { LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { useAuth } from '@/contexts/AuthContext.tsx'

export function LoginButton() {
  const { signInWithGoogle } = useAuth()

  return (
    <Button variant="outline" size="sm" onClick={signInWithGoogle}>
      <LogIn className="mr-2 h-4 w-4" />
      Sign in
    </Button>
  )
}
