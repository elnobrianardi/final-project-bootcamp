import axios from "axios";

export const fetchBanner = async() => {
    try {
        const response = await axios.get('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners', {
            headers : {
                apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c'
            }
        })
        return response.data;
    } catch (error) {
        throw error
    }
}

export const fetchBannerById = async (id) => {
    console.log("Fetching banner with ID:", id)
  try {
    const response = await axios.get(
      `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banner/${id}`,
      {
        headers: {
          apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c',
        },
      }
    )
    return response.data.data
  } catch (error) {
    throw error
  }
}

