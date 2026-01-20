import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust based on your backend port

const vendorService = {
    // Get all apps for a specific vendor
    getVendorApps: async (vendorId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/agents/vendor/${vendorId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching vendor apps:', error);
            throw error;
        }
    },

    // Get detailed info for a specific app
    getAppDetails: async (appId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/agents/${appId}/details`);
            return response.data;
        } catch (error) {
            console.error('Error fetching app details:', error);
            throw error;
        }
    },

    // Deactivate an app
    deactivateApp: async (appId) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/agents/${appId}/deactivate`);
            return response.data;
        } catch (error) {
            console.error('Error deactivating app:', error);
            throw error;
        }
    },

    // Reactivate an app
    reactivateApp: async (appId) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/agents/${appId}/reactivate`);
            return response.data;
        } catch (error) {
            console.error('Error reactivating app:', error);
            throw error;
        }
    },

    // Submit app for review
    submitForReview: async (appId) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/agents/${appId}/submit_review`);
            return response.data;
        } catch (error) {
            console.error('Error submitting app:', error);
            throw error;
        }
    },

    // Update app details (e.g. url)
    updateApp: async (appId, data) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/agents/${appId}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating app:', error);
            throw error;
        }
    },

    // Delete app permanently
    deleteApp: async (appId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/agents/${appId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting app:', error);
            throw error;
        }
    }
};

export default vendorService;
