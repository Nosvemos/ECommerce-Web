import { APP_NAME } from '@/lib/constants'
import IconBoxes from '@/components/icon-boxes'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='border-t'>
      <IconBoxes/>
      <div className='p-5 flex-center'>
        {currentYear} {APP_NAME}. All Rights Reserved
      </div>
    </footer>
  )
}

export default Footer