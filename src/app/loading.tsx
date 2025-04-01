import { Loader2 } from 'lucide-react'

const LoadingPage = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
    }}>
      <Loader2 className='animate-spin' size={30} />
    </div>
  )
}

export default LoadingPage