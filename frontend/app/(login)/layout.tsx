import "@/app/globals.css";
import NavBar  from "@/components/NavBar/NavBar";
import { redirect } from 'next/navigation';
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
        {children}
    </>
  )
}