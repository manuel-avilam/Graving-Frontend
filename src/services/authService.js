import api from './axiosInstance';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';

export const login = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const register = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginGoogle = async () => {
  const googleProvider = new GoogleAuthProvider();
  const auth = getAuth();

  const result = await signInWithPopup(auth, googleProvider);
  const tokenId = await result.user.getIdToken();

  const response = await api.post('/auth/google-login', { tokenId });
  return response.data;
}