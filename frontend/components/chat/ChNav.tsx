"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ChNav = () => {
    const us = usePathname();
    const [buttonstyle1, setButtonstyle1] = useState("border-b-4 text-blue border-blue");
    const [buttonstyle2, setButtonstyle2] = useState('');
    
    const {section1, section2} = us.includes("/chat") ? {section1:"Chat", section2: "Friends"} : {section1:"Channel", section2:"New Channel"};

    const handleclick = (buttonNumber : number) => {
      if(buttonNumber === 1){
        setButtonstyle1("border-b-4 text-blue border-blue");
        setButtonstyle2('');
      
      }
      else {
        setButtonstyle1('');
        setButtonstyle2("border-b-4 text-blue border-blue");
      }
    
    }

    return (
        <div className={` w-full bg-dark-gray+ h-10 flex justify-between  py-2 text-white gap-1`} >
            <button className={`w-1/2 flex items-center justify-center text-lg  ${buttonstyle1}`} onClick={()=> handleclick(1)}>
              {section1} 
            </button>
            <button className={`w-1/2 flex items-center justify-center  text-lg ${buttonstyle2}`} onClick={()=> handleclick(2)}>
              {section2}
            </button>
        </div>


    );
}

export default ChNav;