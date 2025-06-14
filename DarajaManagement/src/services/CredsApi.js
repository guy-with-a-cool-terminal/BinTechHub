import http from "./http";     // contains our shared axios instance

export const saveDarajaCredentials = async (data) => {
    try {
        const res = await http.post('/onboarding/darajacreds/',data);
        return res.data
    } catch (error) {
        throw error;
    }
}

export default{
    saveDarajaCredentials,
};