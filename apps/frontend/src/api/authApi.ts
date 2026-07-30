import axios from "axios";

const BASE_URL = "http://localhost:3000";

export async function loginReq(username: string, password: string) {
    try {
        const res = await axios.post(`${BASE_URL}/api/v1/user/signin`, {
            username,
            password
        }, {
            withCredentials: true
        })

        console.log(res);
        return res.data;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function regiserReq(username: string, password: string) {
    try {
        const res = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
            username,
            password
        })

        console.log(res);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}