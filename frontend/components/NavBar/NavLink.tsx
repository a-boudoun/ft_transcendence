"use client";

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface NavLinkProps {
    route: string;
    src: string;
    alt: string;
    setIsOpen?: (isOpen: boolean) => void;
}

const NavLink = ({route, src, alt, setIsOpen = () => {}}: NavLinkProps) => {

    const router = useRouter();
    const currentRoute = usePathname();
    let color: string;

    if (setIsOpen.length === 1)
        color = 'bg-dark-gray hover:bg-dark-gray';
    else
        color = currentRoute === '/' + route ? 'bg-dark-gray+' : 'bg-[#202E50]  hover:bg-dark-gray+';
    
    return (
      <div className={`grid place-content-center h-[55px] w-[56px] ${color}`}>
        <Link href={route}>
          <Image src={src} alt={alt} width={28} height={28}  onClick={() => setIsOpen(false)} />
        </Link>
      </div>
    )
}

export default NavLink;
  