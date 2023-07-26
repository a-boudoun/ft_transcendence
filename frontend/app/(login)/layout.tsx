import "@/app/globals.css";
import NavBar  from "@/components/NavBar/NavBar";
import { redirect } from 'next/navigation';
import get  from '@/apis/server/get';
import userDto from "@/dto/userDto";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const data: userDto | null = await get('/auth/isAuth');
  if (!data)
    redirect('/');
  
  return (
    <>
        <NavBar />
        {children}
    </>  
  )
}