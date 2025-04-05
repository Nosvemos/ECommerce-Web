'use client';

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SIGN_IN_DEFAULT_VALUES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useActionState } from 'react'
import { signInWithCredentials } from '@/lib/actions/user.actions'
import Form from 'next/form'
import { useFormStatus } from 'react-dom'
import { Loader2Icon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

const CredentialsSignInForm = () => {
  const initialState = {
    success: false,
    message: '',
  };
  const [state, formAction] = useActionState(signInWithCredentials, initialState);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className='w-full'>
        { pending ? (
          <>
            <Loader2Icon className='animate-spin'/>
            <p>Signing In...</p>
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    )
  }

  return (
    <Form action={formAction}>
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
      <div className='space-y-6'>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' name='email' type='email' autoComplete='email' defaultValue={SIGN_IN_DEFAULT_VALUES.email} required />
        </div>
        <div>
          <Label htmlFor='password'>Password</Label>
          <Input id='password' name='password' type='password' autoComplete='password' defaultValue={SIGN_IN_DEFAULT_VALUES.password} required />
        </div>
        <div>
          <SignInButton/>
        </div>
        { state && !state.success && state.message && (
          <div className='text-center text-destructive text-sm'>
            {state.message}
          </div>
        )}
        <div className='text-sm text-center text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <Link href='/sign-up' target='_self' className='link'>Sign Up</Link>
        </div>
      </div>
    </Form>
  )
}

export default CredentialsSignInForm