import axios from "axios";

export const  fetchLoggedUser = async (token) => {
    try {
        const response = await axios.get('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user', {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                Authorization : `Bearer ${token}` 
            }
        })
        console.log('user data :', response.data);
        return response.data.data
    } catch (error) {
        console.log(error.response);        
    }
}

export const updateProfile = async (data, token) => {
    try {
        const response = await axios.post('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-profile', data, {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                Authorization : `Bearer ${token}` 
            }
        })
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(error);
    }
}