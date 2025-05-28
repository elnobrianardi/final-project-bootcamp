import axios from "axios";

export const fetchPromo = async () => {
    try {
        const response = await axios.get('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos', {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c'
            }
        })
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const fetchPromoById = async (id) => {
    try {
        const response = await axios.get(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promo/${id}`, {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c'
            }
        })
        return response.data.data;
    } catch (error) {
        console.log(error);
    }
}