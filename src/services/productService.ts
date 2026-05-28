import api from './api';

export const fetchProducts = async (
  business_id: number
) => {

  const response = await api.get(
    '/products',
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

  const response = await api.post(
    '/products',
    productData
  );

  return response.data;

};