import axios from "axios";

export const login = async(data) => {
    try {
        const response = await axios.post('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/login', data, {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c'
            }
        })
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const register = async(data) => {
    try {
        const response = await axios.post('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/register', data, {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c'
            }
        })
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const logout = async() => {
    try {
        const response = await axios.get('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/logout', {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c',
                token: token
            }
        })
        return response.data;
    } catch (error) {
        console.log(error);
    }
}