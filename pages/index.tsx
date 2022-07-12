import type { NextPage } from 'next'
import Sidebar from '../components/Sidebar'
const Home: NextPage = () => {
  return (
   <div className='flex'>
    <Sidebar />
   </div>
  )
}

export default Home
