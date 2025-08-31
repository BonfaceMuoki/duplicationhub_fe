import api from "../api"
const loginUser = async(credentials) => {
    try{
       const response = api.post('/auth/login', credentials);
       return response;
    }catch(error){
      throw error;
    }
     
}
const logOutUser = async () => {
    try {
        const response = await api.post('auth/logout');
        return response.data; 
    } catch (error) {
        throw error; 
    }
};

const requestPasswordReset = async (data) => {
    try {
        const response = await api.post('/auth/forgot-password', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const resetPassword = async (data) => {
    try {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {loginUser, logOutUser, requestPasswordReset, resetPassword}