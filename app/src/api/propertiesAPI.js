import axios from 'axios';

export async function getAllPropertyClaimsList(gameId) {
    const url = `/propertyClaims/game/${gameId}/listAllPropertyClaims`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log(err);
        throw new Error(err.response.data.message);
    }
}

export async function purchasePropertyClaimFromBank(data) {
    const url = `/propertyClaims/purchasePropertyClaimFromBank`;
    try {
        const response = await axios.put(url, data);
        return response.data;
    } catch (err) {
        console.log(err);
        throw new Error(err.response.data.message);
    }
}
