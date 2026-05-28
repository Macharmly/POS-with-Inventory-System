import api from './api';

export const fetchLogs =
  async () => {

    const response =
      await api.get('/logs');

    return response.data;

  };