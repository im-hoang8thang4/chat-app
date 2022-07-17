import type { NextPage } from 'next'
import Head from "next/head";
import Sidebar from '../components/Sidebar'
const Home: NextPage = () => {
  return (
   <div className='flex'>
    <Head>
        <title>Chat App</title>
      </Head>
    <Sidebar />
   </div>
  )
}

export default Home
