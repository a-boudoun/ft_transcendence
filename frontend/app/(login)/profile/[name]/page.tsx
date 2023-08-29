import ProfileComponent from "@/components/profile/ProfileComponent";
import getData from "@/apis/server/get";
import userDto from "@/dto/userDto";
import { redirect } from 'next/navigation';

const Profile = async ({params}: { params: { name: string } }) => {
  const data: userDto = await getData('/users/me');

  if (data.name === params.name)
  {  
    redirect('/profile');
  }

  return (
    <ProfileComponent id={params.name}/>
  )
}

export default Profile;