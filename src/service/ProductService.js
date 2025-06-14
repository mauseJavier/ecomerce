import config from '@/config';
import axios from 'axios';

export const ProductService = {
    async getProducts(page = 1) {
        // Usar la URL de la API desde la configuración y permitir paginación
        const response = await axios.get(`${config.apiUrl}/inventarios/${config.empresa_id}?per_page=20&page=${page}`);

        console.log(`${config.apiUrl}/inventarios/${config.empresa_id}?per_page=20&page=${page}` + ' Response from API: ', response.data);
        if (!response.data || !response.data.data) {
            throw new Error('No data found in the response');
        }
        // Retornar el objeto completo para paginación
        return response.data;
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
