import axios from "axios";

export const createBanner = async (data, token) => {
    try {
        const response = await axios.post('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-banner', data, {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                Authorization: `Bearer ${token}`
            }
        })
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const updateBanner = async (id, data, token) => {
    try {
        const response = await axios.post(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-banner/${id}`, data, {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                Authorization: `Bearer ${token}`
            }
        })
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const deleteBanner = async (id, token) => {
    try {
        const response = await axios.delete(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-banner/${id}`, {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                Authorization: `Bearer ${token}`
            }
        })
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(error);
    }
}