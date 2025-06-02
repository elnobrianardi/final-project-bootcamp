import axios from 'axios';

export const uploadImage = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(
      'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data.url; 
  } catch (error) {
    console.error('Upload image failed:', error.response || error.message);
    throw error;
  }
};
