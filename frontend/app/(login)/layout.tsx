import "@/app/globals.css";
import NavBar  from "@/components/NavBar/NavBar";
import { redirect } from 'next/navigation';
import get  from '@/apis/server/get';
import userDto from "@/dto/userDto";
import axios from "axios";
import { cookies } from 'next/headers';


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <>
        <NavBar />
        {children}
    </>
  )
}