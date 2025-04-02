'use client';

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SIGN_UP_DEFAULT_VALUES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useActionState } from 'react'
import { signUpUser } from '@/lib/actions/user.actions'
import Form from 'next/form'
import { useFormStatus } from 'react-dom'
import { Loader2Icon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

const CredentialsSignUpForm = () => {
  const initialState = {
    success: false,
    message: '',
  };
  const [state, formAction] = useActionState(signUpUser, initialState);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const SignUpButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className='w-full'>
        { pending ? (
          <>
            <Loader2Icon className='animate-spin'/>
            <p>Signing Up...</p>
          </>
        ) : (
          'Sign Up'
        )}
      </Button>
    )
  }

  return (
    <Form action={formAction}>
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
      <div className='space-y-6'>
        <div>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' name='name' type='text' autoComplete='name' defaultValue={SIGN_UP_DEFAULT_VALUES.name} required />
        </div>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' name='email' type='email' autoComplete='email' defaultValue={SIGN_UP_DEFAULT_VALUES.email} required />
        </div>
        <div>
          <Label htmlFor='password'>Password</Label>
          <Input id='password' name='password' type='password' autoComplete='password' defaultValue={SIGN_UP_DEFAULT_VALUES.password} required />
        </div>
        <div>
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <Input id='confirmPassword' name='confirmPassword' type='password' autoComplete='password' defaultValue={SIGN_UP_DEFAULT_VALUES.confirmPassword} required />
        </div>
        <div>
          <SignUpButton/>
        </div>
        { state && !state.success && state.message && (
          <div className='text-center text-destructive text-sm'>
            {state.message}
          </div>
        )}
        <div className='text-sm text-center text-muted-foreground'>
          Already have an account?{' '}
          <Link href='/sign-in' target='_self' className='link'>Sign In</Link>
        </div>
      </div>
    </Form>
  )
}

export default CredentialsSignUpForm