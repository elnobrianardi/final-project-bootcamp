import axios from "axios";

export const createTransaction = async (data, token) => {
  try {
    const response = await axios.post(
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-transaction",
      data,
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Create Transaction", response.data);
    return response.data;
  } catch (error) {
    console.log("Error status:", error.response?.status);
    console.log("Error data:", error.response?.data);
    console.log(error);
  }
};

export const fetchMyTransaction = async (token) => {
  try {
    const response = await axios.get(
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/my-transactions",
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchTransactionById = async (id, token) => {
  try {
    const response = await axios.get(
      `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/transaction/${id}`,
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const cancelTransaction = async (transactionId, token) => {
  try {
    const response = await axios.post(
      `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/cancel-transaction/${transactionId}`,
      {}, 
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error status:", error.response?.status);
    console.log("Error data:", error.response?.data);
  }
};
