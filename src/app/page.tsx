import Image from 'next/image'
import styles from './page.module.css'
import { users } from '../data/fetching'


export default function Home({ users}) {
  console.log(users)
  return (
    <div>hello</div>
    // <div className="flex h-screen justify-between">
    //   <div className="w-1/3 p-4">
    //     <div className="h-[90%] bg-[#5B6375]"></div>
    //   </div>
    //   <div className="w-1/3 p-4">
    //     <div className="h-[90%] bg-[#5B6375]"></div>
    //   </div>
    //   <div className="w-1/3 p-4">
    //     <div className="h-[90%] bg-[#5B6375]"></div>
    //   </div>
    // </div>

  )
}
