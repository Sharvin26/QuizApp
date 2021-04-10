import axios from 'axios';

export const addQuizApi = async (auth, values) => {
  try {
    const header = {
      'Content-Type': 'application/json',
      token: auth.token,
    };
    const resp = await axios.post('/api/quiz', values, { headers: header });
    return resp;
  } catch (error) {
    throw error;
  }
};
