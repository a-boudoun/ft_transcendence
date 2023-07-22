import React from 'react'
import UpdateForm from '@/components/settings/UpdateForm'

const Settings = () => {
  return (
    <>
    <main className="h-full p-[56px] bg-dark-gray sm:pt-[96px]">
      <div className='h-full max-w-[640px] grow flex flex-col sm:mx-auto sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:p-4 sm:rounded-[2.5rem] sm:shadow-2xl'>
        <UpdateForm />
      </div>
    </main>
    </>
  )
}

export default Settings;