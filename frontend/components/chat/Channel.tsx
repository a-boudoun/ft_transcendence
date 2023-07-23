import getData from "@/apis/getData";
import ChNav from "./ChNav";
import Messeges from "./Messeges";
import Friends from "@/components/common/Friends";
import userDto from "@/dto/userDto";

const Channel = async() => {
    console.log("-------------------");
    const data = await getData('/channels');
    console.log(data);
    return (
            <ChNav data={data}  path="/chat"/>
    );
}

export default Channel;