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

export const updateService =
  async (
    id: number,
    serviceData: any
  ) => {

    const response =
      await axios.put(

        `${API_URL}/services/${id}`,

        serviceData

      );

    return response.data;

  };

export const deleteService =
  async (
    id: number
  ) => {

    const response =
      await axios.delete(

        `${API_URL}/services/${id}`

      );

    return response.data;

  };

export const fetchServiceProducts =
  async (
    serviceId: number
  ) => {

    const response =
      await axios.get(

        `${API_URL}/services/${serviceId}/products`

      );

    return response.data;

  };

  export const addServiceProduct =
  async (
    serviceId: number,
    productId: number
  ) => {

    const response =
      await axios.post(

        `${API_URL}/services/${serviceId}/products`,

        {
          product_id: productId
        }

      );

    return response.data;

  };

export const removeServiceProduct =
  async (
    serviceId: number,
    productId: number
  ) => {

    const response =
      await axios.delete(

        `${API_URL}/services/${serviceId}/products/${productId}`

      );

    return response.data;

  };