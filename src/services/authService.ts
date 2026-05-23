import axios from 'axios';

const API_URL =
  'http://localhost:5000/api';

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