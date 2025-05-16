import axios from 'axios';

const API_URL = "http://localhost:8000/api/registrations";

// create a new registration
export const createRegistration = async (formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  
  try {
    const response = await axios.post(API_URL, formData, config);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// get all registrations
export const getRegistrations = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get a registration by id
export const getRegistration = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update a registration
export const updateRegistration = async (id, formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  
  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, config);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete a registration
export const deleteRegistration = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};