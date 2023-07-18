import Image from 'next/image';
import { useState } from 'react';


const NewChannel = () => {
    const [isclicked, setIsclicked] = useState(false);

    const handleclick = () => {
        setIsclicked(!isclicked);
    }
    return (

        <div className=' w-full bg-dark-gray p-4 rounded-xl h-fit' >
            <input className='w-full rounded-lg px-5 py-2 text-lg bg-light-gray my-2 outline-none' placeholder='Name of channel' />
            <button className="text-white w-full  rounded-lg text-lg px-5 py-2.5 text-center inline-flex items-center justify-center bg-blue" onClick={handleclick}>
                Public 
                <svg
                    className="w-2.5 h-2.5 ml-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>
            <div className={` ${isclicked === true ? '': 'hidden'}  py-2 my-2 rounded-lg divide-y divide-gray-100 shadow w-full bg-blue`}>
                <div>

                    <h1 className='hover:bg-light-gray py-1'>Public</h1>
                    <h1 className='hover:bg-light-gray py-1'>Private</h1>
                    <h1 className='hover:bg-light-gray py-1'>Protected</h1>
                </div>
            </div>
            <input type='password' className={` w-full rounded-lg px-5 py-2 text-lg bg-light-gray my-2 outline-none`} placeholder='Password' />
        </div>

    )
}

export default NewChannel;