<script setup>
import pkg from '../../package.json';
const version = pkg.version;
</script>

<template>
    <div class="layout-footer flex flex-col items-center justify-center gap-1 text-xs">
        <div>
            LLFACTURA
            <a href="https://llfactura.com" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Las Lajas NQN</a>
        </div>
        <div class="text-gray-400">Versión {{ version }}</div>
    </div>
</template>
