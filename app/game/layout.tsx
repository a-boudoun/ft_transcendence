import NavBar from '../../conponents/NavBar'


export default function RootLayout({
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