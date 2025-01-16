import axios from 'axios';

export const fetchEntities = async (endpoint: string) => {
  try {
    const response = await axios.get(endpoint);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error fetching data from ${endpoint}`);
  }
};

export const updateEntity = async (
  endpoint: string,
  id: number,
  entityData: object
) => {
  try {
    await axios.put(`${endpoint}/${id}`, entityData);
  } catch (error) {
    throw new Error(`Error updating entity with id ${id}`);
  }
};

export const deleteEntity = async (endpoint: string, id: number) => {
  try {
    await axios.delete(`${endpoint}/${id}`);
  } catch (error) {
    throw new Error(`Error deleting entity with id ${id}`);
  }
};

export const createEntity = async (endpoint: string, entityData: object) => {
  try {
    await axios.post(`${endpoint}`, entityData);
  } catch (error) {
    throw new Error('Error creating entity');
  }
}