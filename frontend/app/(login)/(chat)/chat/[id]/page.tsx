import getData from "@/apis/getData";
import Mid from "@/components/chat/Mid";
import userDto from "@/dto/userDto";

const page = async() => {
    const user : userDto = await getData('/users/getUser');
    return (
        <>
            <Mid user={user}/>
            <div className={`hidden lg:flex lg:w-3/12 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-xl`}>
            </div>
        </>
    );
}
 
export default page;