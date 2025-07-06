<script setup>
import config from '@/config';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const categorias = ref([]);
const loading = ref(false);
const error = ref('');

async function cargarCategorias() {
    loading.value = true;
    error.value = '';
    try {
        // Construir la URL con el empresa_id
        const url = `${config.rubrosUrl.replace(/\/$/, '')}/${config.empresa_id}`;
        const response = await axios.get(url);
        categorias.value = response.data.data || response.data;
        console.log('Categorías cargadas:', categorias.value);
    } catch (e) {
        error.value = 'No se pudieron cargar las categorías';
    } finally {
        loading.value = false;
    }
}

onMounted(cargarCategorias);
</script>

<template>
    <li>
        <div class="font-bold px-3 py-2">Categorías</div>
        <ul v-if="!loading && !error">
            <li v-for="cat in categorias" :key="cat.id" class="pl-4 py-1">
                <router-link :to="{ path: '/productos', query: { cat: cat || cat.detalle || cat.rubro || cat.name } }">
                    <i class="pi pi-tag mr-2" />
                    {{ cat || cat.detalle || cat.rubro || cat.name }}
                </router-link>
            </li>
        </ul>
        <div v-else-if="loading" class="pl-4 py-1 text-gray-400">Cargando...</div>
        <div v-else-if="error" class="pl-4 py-1 text-red-500">{{ error }}</div>
    </li>
</template>

<style scoped>
.font-bold { font-weight: bold; }
</style>
