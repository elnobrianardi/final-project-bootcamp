import axios from "axios";

export const fetchPayment = async () => {
  try {
    const response = await axios.get(
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/payment-methods",
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      }
    );
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const uploadPaymentProof = async (transactionId, url, token) => {
  try {
    const response = await axios.post(
      `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-proof-payment/${transactionId}`,
      { proofPaymentUrl: url },
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Upload success, link:", response.data);
    return response.data;
  } catch (error) {
    console.log(error.response);
  }
};
