import axios from "axios";

export async function getCurrentUser() {
  const url = `/users/currentUser`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}

export async function editUser(data) {
  const url = `/users/currentUser/editUser`;
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}
