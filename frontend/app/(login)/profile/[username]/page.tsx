import ProfileComponent from "@/components/profile/ProfileComponent";
import { redirect } from 'next/navigation'
import axios from "axios";

const Profile = async ({params}: { params: {username: string } }) => {

return (
  <ProfileComponent username={params.username}/>
  )
    
}
  
export default Profile;