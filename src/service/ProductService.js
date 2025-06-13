import config from '@/config';
import axios from 'axios';

export const ProductService = {
    async getProducts() {
        // Usar la URL de la API desde la configuración
        const response = await axios.get(`${config.apiUrl}/inventarios/${config.empresa_id}?per_page=20&page=1`);

        console.log(`${config.apiUrl}/inventarios/${config.empresa_id}?per_page=20&page=1` + ' Response from API: ', response.data);
        if (!response.data || !response.data.data) {
            throw new Error('No data found in the response');
        }
        return response.data.data;
    },

    async searchProducts(query) {
        const response = await axios.get(`${config.apiUrl}/inventarios/${config.empresa_id}/buscar`, {
            params: { q: query }
        });
        if (!response.data || !response.data.data) {
            throw new Error('No data found in the response');
        }
        return response.data.data;
    }
};
