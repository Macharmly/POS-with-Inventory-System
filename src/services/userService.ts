import axios from 'axios';

const API_URL =
  'http://localhost:5000/api/users';

const getAuthConfig = () => {

  const token =
    localStorage.getItem('token');

  return {

    headers: {
      Authorization:
        `Bearer ${token}`
    }

  };

};

export const fetchUsers = async () => {

  const response =
    await axios.get(
      API_URL,
      getAuthConfig()
    );

  return response.data;

};

export const createUser = async (
  userData: any
) => {

  const response =
    await axios.post(
      API_URL,
      userData,
      getAuthConfig()
    );

  return response.data;

};

export const updateUser = async (
  id: number,
  userData: any
) => {

  const response =
    await axios.put(
      `${API_URL}/${id}`,
      userData,
      getAuthConfig()
    );

  return response.data;

};

export const deleteUser = async (
  id: number
) => {

  const response =
    await axios.delete(
      `${API_URL}/${id}`,
      getAuthConfig()
    );

  return response.data;

};