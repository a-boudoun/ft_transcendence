import Left from "@/components/chat/Left";

export default function LoginLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: string
}) {

  const ischild = true;
  

  return (
   
    <main className={`h-screen w-full pt-[56px]  sm:p-10 sm:pt-[96px] mx-auto flex  max-w-7xl `}>
     
        <Left />
        {children}
  
    </main>
  
  )
}
