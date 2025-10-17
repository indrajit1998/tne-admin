import axios from 'axios';

const api = axios.create({
  //baseURL: 'https://api.timestringssystem.com', 
  baseURL: process.env.REACT_APP_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// API helper functions for reports
export const getTravelerReport = async (page = 1, limit = 30) => {
  try {
    const response = await api.get(`api/v1/admin/getTravellerReport?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching traveler report:', error);
    throw error;
  }
};

export const getSenderReport = async (page = 1, limit = 30) => {
  try {
    const response = await api.get(`api/v1/admin/getSenderReport?page=${page}&limit=${limit}`);
    console.log("responseof sender report",response);
    return response.data;
  } catch (error) {
    console.error('Error fetching sender report:', error);
    throw error;
  }
};

export const getSenderConsignmentDetails = async (senderPhone) => {
  try {
    const response = await api.get(`api/v1/admin/sender-consignment-details/${senderPhone}`);
    console.log("response of sender consignment details",response);
    return response.data;
  } catch (error) {
    console.error('Error fetching sender consignment details:', error);
    throw error;
  }
};

export const getTravelerConsignmentDetails = async (travelerPhone) => {
  try {
    const response = await api.get(`api/v1/admin/traveler-consignment-details/${travelerPhone}`);
    console.log("response of traveler consignment details",response);
    return response.data;
  } catch (error) {
    console.error('Error fetching traveler consignment details:', error);
    throw error;
  }
};
export const getConsolidatedReportData = async () => {
  try {
    const response = await api.get('/api/v1/admin/getConsolidateConsignment');
    console.log("consolidated data",response);
    return response.data;
  } catch (error) {
    console.error('Error fetching consignment consolidated report:', error);
    throw error;
  }
};

export const getBusinessIntelligenceReport = async () => {
  try {
    const response = await api.get('api/v1/report/business-intelligence');
    return response.data;
  } catch (error) {
    console.error('Error fetching business intelligence report:', error);
    throw error;
  }
};

export const getTravelDetailsReport = async () => {
  try {
    const response = await api.get('api/v1/report/travel-details');
    return response.data;
  } catch (error) {
    console.error('Error fetching travel details report:', error);
    throw error;
  }
};

export default api;
