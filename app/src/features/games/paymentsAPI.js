import axios from 'axios';

export async function sendPayment(data) {
    const url = `/pay`;
    try {
        const response = await axios.put(url, data);
        return response.data;
    } catch (err) {
        console.log(err);
        throw new Error(err.response.data.message);
    }
}
