import axios from "axios";

export const fetchCart = async (token) => {
    try {
        const response = await axios.get('https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/carts', {
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

export const addToCart = async (id, token) => {
  try {
    const response = await axios.post(
      'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/add-cart',
      { activityId: id },
      {
        headers: {
          apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c',
          Authorization: `Bearer ${token}`,
        },
      }
    )
    console.log('added to cart')
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateCart = async (cartId, token, quantity) => {
  try {
    const response = await axios.post(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-cart/${cartId}`, {quantity }, {
      headers: {
        apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c',
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.log(error);
  }
}

export const deleteCart = async (cartId, token) => {
  try {
    const response = await axios.delete(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-cart/${cartId}`, {
      headers: {
        apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c',
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response.data);
    return response.data
  } catch (error) {
    console.log(error);
  }
}
