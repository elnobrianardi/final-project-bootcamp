import axios from "axios";

export const fetchAllUser = async (token) => {
    try {
        const response = await axios.get('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-user', {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                Authorization: `Bearer ${token}`
            }
        })
        console.log(response.data.data);
        return response.data.data
    } catch (error) {
        console.log(error);
    }
}

export const updateRole = async (userId, role, token) => {
    try {
        const response = await axios.post(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-user-role/${userId}`, 
            {role: role}, {
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