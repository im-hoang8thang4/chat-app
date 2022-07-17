import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../config/firebase'
import { Imessage } from '../interface'

const Message = ({message} : {message: Imessage}) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth)

  return loggedInUser?.email === message.user ? (
<div className='m-[10px]'>
    <div className='bg-gradient-to-t from-orange-400 to-sky-400 flex flex-col w-fit min-w-[30%] max-w-[90%] ml-auto p-3 rounded-xl break-all gap-2'>
        <div className=''>
            {message.text}
        </div>
        <span className='text-xs text-gray-500 ml-auto'>
            {message.sent_at}
        </span>
    </div>
</div>
  ) :(
    <div className='m-[10px]'>
    <div className='bg-gray-300 flex flex-col w-fit min-w-[30%] max-w-[90%] mr-auto p-3 rounded-xl break-all gap-2'>
        <div className=''>
            {message.text}
        </div>
        <span className='text-xs text-gray-500 ml-auto'>
            {message.sent_at}
        </span>
    </div>
</div>
  )
}

export default Message