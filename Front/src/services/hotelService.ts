import axios from 'axios';
import { Hotel } from '../interface/hotel';

export async function fetchHoteles(): Promise<Hotel[]> {
  const response = await axios.get('/api/hotel');
  return response.data.data || response.data;
}
