import axios from 'axios';

const API_URL =
  'http://localhost:5000/api';

export const fetchServices =
  async (
    business_id?: number
  ) => {

  const response =
    await axios.get(

      `${API_URL}/services`,

      {
        params: {
          business_id
        }
      }

    );

  return response.data;

};

export const createService =
  async (serviceData: any) => {

  const response =
    await axios.post(

      `${API_URL}/services`,

      serviceData

    );

  return response.data;

};