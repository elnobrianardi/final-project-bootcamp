import axios from 'axios'

export const fetchActivity = async () => {
    try {
        const response = await axios.get('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities', {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c'
            }
        })
        return response.data.data
    } catch (error) {
        console.log(error);        
    }
}

export const fetchActivityById = async (id) => {
    try {
        const response = await axios.get(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activity/${id}`, {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c'
            }
        })
        return response.data.data
    } catch (error) {
        console.log(error);
    }
}

export const filterByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities-by-category/${categoryId}`, {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c'
            }
        })
        return response.data.data
    } catch (error) {
        console.log(error);
    }
}