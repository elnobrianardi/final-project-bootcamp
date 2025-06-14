import axios from "axios";

export const createActivity = async (data, token) => {
    try {
        const response = await axios.post('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-activity', data, {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                Authorization: `Bearer ${token}`
            }
        })
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(error);
    }}

export const updateActivity = async (id, data, token) => {
    try {
        const response = await axios.post(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-activity/${id}`, data, {
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

export const deleteActivity = async (id, token) => {
    try {
        const response = await axios.delete(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-activity/${id}`, {
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


 