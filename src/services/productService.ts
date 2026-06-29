import api from './api';

export const fetchProducts = async (
  business_id: number,
  status?: 'active' | 'inactive'
) => {
  const response = await api.get(
    '/products',
    {
      params: {
        business_id,
        status
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

export const fetchDropdownOptions = async (
  type: string,
  business_id: number
) => {
  const response = await api.get(
    `/products/dropdowns/${type}`,
    {
      params: {
        business_id
      }
    }
  );

  return response.data;
};

export const createDropdownOption = async (
  type: string,
  business_id: number,
  name: string
) => {
  const response = await api.post(
    `/products/dropdowns/${type}`,
    {
      business_id,
      name
    }
  );

  return response.data;
};

export const updateProduct = async (
  id: number,
  productData: any
) => {
  const response = await api.put(
    `/products/${id}`,
    productData
  );

  return response.data;
};

export const deleteProduct = async (
  id: number,
  business_id: number
) => {
  const response = await api.delete(
    `/products/${id}`,
    {
      data: {
        business_id
      }
    }
  );

  return response.data;
};