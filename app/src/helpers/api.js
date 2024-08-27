import axios from "axios";

export const makeRequest = async (url, method = "post", obj) => {
  const response = await axios({
    method,
    url,
    data: obj,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res)
    .catch((res) => {
      return res.response;
    });
  return response?.data;
};
