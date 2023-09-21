import axios from "axios";

const API_URL = "http://localhost:5000";

export const createOrder = async (data) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/orders",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  });
  return response.data;
};

export const fetchOrders = async () => {
  const response = await axios.get(API_URL + "/orders");
  return response.data;
};
