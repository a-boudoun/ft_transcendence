import ProfileComponent from "@/components/profile/ProfileComponent";

const Profile = async ({params}: { params: {username: string } }) => {

return (
  <ProfileComponent username={params.username}/>
  )
    
}
  
export default Profile;