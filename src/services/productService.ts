import axios from 'axios';

const API_URL =
  'http://localhost:5000/api';

export const fetchProducts = async (
  business_id: number
) => {

  const response = await axios.get(
    `${API_URL}/products`,
    {
      params: {
        business_id
      }
    }
  );

  return response.data;

};

export const createProduct = async (
  productData: any
) => {

  const response = await axios.post(
    `${API_URL}/products`,
    productData
  );

  return response.data;

};