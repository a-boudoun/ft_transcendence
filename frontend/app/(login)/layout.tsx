import "@/app/globals.css";
import NavBar  from "@/components/NavBar/NavBar";
import { redirect } from 'next/navigation';
import getData from  "@/apis/getData";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // const data: userDto | null = await getData('http://localhost:8000/auth/isAuth');
  // if (!data)
  //   redirect('/');
  
  return (
    <>
        <NavBar />
        {children}
    </>
  )
}