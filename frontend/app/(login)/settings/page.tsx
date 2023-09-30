import React from 'react'
import UpdateForm from '@/components/settings/Settings'

const Settings = () => {
  return (
    <>
    <main className="p-[56px] bg-bg bg-cover sm:p-10 sm:pt-[96px] sm:flex sm:justify-center">
      <div className='max-w-[640px] grow flex flex-col sm:mx-auto sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:rounded-[2.5rem] sm:shadow-2xl'>
        <UpdateForm />
      </div>
    </main>
    </>
  )
}

export default Settings;