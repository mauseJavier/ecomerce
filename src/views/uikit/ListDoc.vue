<script setup>
import { ProductService } from '@/service/ProductService';
import { useCartStore } from '@/store/cart';
import { onMounted, ref } from 'vue';

const products = ref([]);
const options = ref(['list', 'grid']);
const layout = ref('list');
const cart = useCartStore()

onMounted(async () => {
    try {
        // Usar el ProductService para obtener los productos desde la API
        products.value = await ProductService.getProducts();
    } catch (e) {
        products.value = [];
    }
});

function getSeverity(product) {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
}

function handleAddToCart(producto) {
  cart.addToCart(producto)
  // Mostrar el JSON del carrito actual en consola
  console.log('Carrito para API:', JSON.stringify(cart.cartForApi, null, 2))
}
</script>

<template>
    <div class="flex flex-col">
        <div class="card">
            <div class="font-semibold text-xl">Productos</div>
            <DataView :value="products" :layout="layout">
                <template #header>
                    <div class="flex justify-end">
                        <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                            <template #option="{ option }">
                                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                            </template>
                        </SelectButton>
                    </div>
                </template>
                <template #list="slotProps">
                    <div class="flex flex-col">
                        <div v-for="(item, index) in slotProps.items" :key="index">
                            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface': index !== 0 }">
                                <div class="md:w-40 relative">
                                    <img
                                        class="block xl:block mx-auto rounded w-full"
                                        :src="Array.isArray(item.imagen) && item.imagen.length > 0 ? item.imagen[0] : '/demo/images/landing/mockup.svg'"
                                        :alt="item.detalle"
                                    />
                                </div>
                                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                    <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                        <div>
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.marca }}</span>
                                            <div class="text-lg font-medium mt-2">{{ item.detalle }}</div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col md:items-end gap-8">
                                        <span class="text-xl font-semibold">${{ item.precio1 }}</span>
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                            <Button icon="pi pi-heart" outlined></Button>
                                            <Button icon="pi pi-shopping-cart" label="Comprar" :disabled="false" class="flex-auto md:flex-initial whitespace-nowrap" @click="handleAddToCart(item)" ></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #grid="slotProps">
                    <div class="grid grid-cols-12 gap-4">
                        <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                            <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                                <div class="bg-surface-50 flex justify-center rounded p-4">
                                    <div class="relative mx-auto">
                                        <img
                                            class="rounded w-full"
                                            :src="Array.isArray(item.imagen) && item.imagen.length > 0 ? item.imagen[0] : '/demo/images/landing/mockup.svg'"
                                            :alt="item.detalle"
                                            style="max-width: 300px"
                                        />
                                    </div>
                                </div>
                                <div class="pt-6">
                                    <div class="flex flex-row justify-between items-start gap-2">
                                        <div>
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.marca }}</span>
                                            <div class="text-lg font-medium mt-1">{{ item.detalle }}</div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-6 mt-6">
                                        <span class="text-2xl font-semibold">${{ item.precio1 }}</span>
                                        <div class="flex gap-2">
                                            <Button icon="pi pi-shopping-cart" label="Comprar" :disabled="false" class="flex-auto whitespace-nowrap" @click="handleAddToCart(item)" ></Button>
                                            <Button icon="pi pi-heart" outlined></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
    </div>
</template>
