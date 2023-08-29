import "@/app/globals.css";
import NavBar  from "@/components/NavBar/NavBar";
import Invite from "@/components/game/Invite";
import { redirect } from 'next/navigation';
import get  from '@/apis/server/get';
import userDto from "@/dto/userDto";
import Modal from "@/components/chat/Modal";
import ReduxProvider from "@/redux/provider";
import axios from "axios";
import { cookies } from 'next/headers';


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const cookieStore = cookies();
  const token = cookieStore.get('access_token');
  const url = `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/isAuth`;

  await axios.get(url , {'headers' : {'cookie' : `access_token=${token?.value}`}}).catch((err : any) => {redirect('/')}); 
  
  return (
    <>
        <NavBar />
        <Invite/>
        {children}
       
    </>  
  )
}