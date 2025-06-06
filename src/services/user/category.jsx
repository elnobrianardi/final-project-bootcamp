import axios from "axios";

export const fetchCategory = async() => {
    try {
        const response = await axios.get('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories', {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c'
            }
        })
        console.log(response.data);
        return response.data.data
    } catch (error) {
        console.log(error);
    }
}

export const fetchCategoryById = async(id) => {
    try {
        const response = await axios.get(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/category/${id}`, {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c'
            }
        })
        return response.data.data
    } catch (error) {
        console.log(error);
    }
}