
const uploadImage = async(image : any) => {

    const formdata = new FormData();

    formdata.append('file', image);
    formdata.append('upload_preset', 'pofiles_images');
    const endpoint = `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL}`;
    const res = await fetch(endpoint, {
        method: 'POST',
        body: formdata,
    });
    const data = await res.json();

    return data.secure_url;

}

export default uploadImage