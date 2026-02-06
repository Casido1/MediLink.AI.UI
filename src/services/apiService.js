import axios from 'axios';

const BASE_URL = 'https://medilinkaiservice-production.up.railway.app/';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const consultationService = {
    startAnalysis: async (patientNotes, existingMeds) => {
        const response = await apiClient.post('/api/Consultation/start', {
            patientNotes,
            existingMeds,
        });
        return response.data;
    },
};

export default apiClient;
