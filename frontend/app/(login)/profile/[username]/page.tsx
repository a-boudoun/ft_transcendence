import ProfileComponent from "@/components/profile/ProfileComponent";
import getData from "@/apis/server/get";
import userDto from "@/dto/userDto";
import { redirect } from 'next/navigation';

const Profile = async ({params}: { params: { username: string } }) => {

  const data: userDto = await getData('/users/me');

  if (data.username === params.username)
    redirect('/profile');

  return (
    <ProfileComponent id={params.username}/>
  )
}

export default Profile;