import { ReactNode } from 'react'
import Navbar from '@/components/navbar'
// import the children prop type as reactnode and import it from react
const layout = ({children}: {children: ReactNode}) => {
  return (
    <div>
        <Navbar />
      {children}
    </div>
  )
}

export default layout
