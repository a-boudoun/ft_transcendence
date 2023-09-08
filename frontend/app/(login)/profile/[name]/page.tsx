import ProfileComponent from "@/components/profile/ProfileComponent";

const Profile = async ({params}: { params: { name: string } }) => {
  
  return (
    <ProfileComponent id={params.name}/>
  )
  
}

export default Profile;