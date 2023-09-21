import React from 'react'
import UpdateForm from '@/components/settings/UpdateForm'

const Settings = () => {
  return (
      <div className='bg-red max-w-[640px] grow flex flex-col sm:mx-auto sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:rounded-[2.5rem] sm:shadow-2xl'>
        <UpdateForm />
      </div>
  )
}

export default Settings;