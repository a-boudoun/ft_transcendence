
const uploadImage = async(image : any) => {

    const formdata = new FormData();

    formdata.append('file', image);
    formdata.append('upload_preset', 'pofiles_images');
    const endpoint = 'https://api.cloudinary.com/v1_1/dwif6n6z6/image/upload';
    const res = await fetch(endpoint, {
        method: 'POST',
        body: formdata,
    });
    const data = await res.json();

    return data.secure_url;

}

export default uploadImage