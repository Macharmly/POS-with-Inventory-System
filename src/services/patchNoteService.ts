import api from './api';

export const fetchPatchNotes = async () => {

  const response =
    await api.get('/patch-notes');

  return response.data;

};

export const fetchLatestPatchNote = async () => {

  const response =
    await api.get('/patch-notes/latest');

  return response.data;

};

export const createPatchNote = async (
  data: {
    version: string;
    title: string;
    content: string;
    created_by: number;
  }
) => {

  const response =
    await api.post(
      '/patch-notes',
      data
    );

  return response.data;

};

export const updatePatchNote = async (
  id: number,
  data: any
) => {

  const response =
    await api.put(
      `/patch-notes/${id}`,
      data
    );

  return response.data;

};

export const deletePatchNote = async (
  id: number
) => {

  const response =
    await api.delete(
      `/patch-notes/${id}`
    );

  return response.data;

};