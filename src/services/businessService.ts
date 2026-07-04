import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || '/api'

export const fetchBusinessById = async (
  businessId: number
) => {
  const response =
    await axios.get(
      `${API_URL}/business/${businessId}`
    );

  return response.data;
};

export const updateBusiness = async (
  businessId: number,
  businessData: any
) => {
  const response =
    await axios.put(
      `${API_URL}/business/${businessId}`,
      businessData
    );

  return response.data;
};