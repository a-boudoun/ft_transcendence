import React from 'react'
import Enable2FA from '@/components/settings/enable2FA/enable2FA'

const fact2auth = () => {
  return (
    <>
    <main className="h-full p-[56px] sm:pt-[96px]">

      <div className='h-full max-w-[640px] grow flex flex-col  sm:mx-auto sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:rounded-[2.5rem] sm:shadow-2xl'>
        <Enable2FA />
      </div>
    </main>
    </>
  )
}

export default fact2auth;