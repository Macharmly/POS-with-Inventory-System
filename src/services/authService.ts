import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL;

export const loginUser = async (

  email: string,

  password: string,

  business_id: number

) => {

  const response =
    await axios.post(

      `${API_URL}/auth/login`,

      {

        email,
        password,
        business_id

      }

    );

  return response.data;

};

export const requestPasswordReset = async (

  email: string,

  business_id: number

) => {

  const response =
    await axios.post(

      `${API_URL}/auth/forgot-password`,

      {

        email,
        business_id

      }

    );

  return response.data;

};