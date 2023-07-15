import Messeges from "./Messeges";
import Friends from "@/components/common/Friends";
import getData from  "@/apis/getData";
import userDto from "@/dto/userDto";


const Friend = async() => {
   
    const data: userDto[] = await getData('/users');
    console.log(data)
    
    return (

        <div className={` h-full`}>
            <Messeges data={data}  path="/chat"/>
        </div>

    );
}

export default Friend;