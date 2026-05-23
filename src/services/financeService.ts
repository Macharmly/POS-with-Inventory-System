import axios from 'axios';

const API_URL =
  'http://localhost:5000/api/finance';

export const fetchExpenses =
  async (
    businessId: number,
    startDate?: string,
    endDate?: string
  ) => {

    const response =
      await axios.get(

        `${API_URL}/expenses/${businessId}`,

        {
          params: {
            startDate,
            endDate
          }
        }

      );

    return response.data;

  };

export const createExpense =
  async (data: any) => {

    const response =
      await axios.post(

        `${API_URL}/expenses`,
        data

      );

    return response.data;

  };