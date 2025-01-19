<script lang='ts' setup>
import { onMounted, onUnmounted, ref } from 'vue';

const toastPosition = ref<string>(getPosition());

function getPosition() {
    return window.innerWidth < 768 ? 'top-center' : 'top-right';
}

const updatePosition = () => {
    toastPosition.value = getPosition();
};

onMounted(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
});

onUnmounted(() => {
    window.removeEventListener('resize', updatePosition);
})

</script>

<template>
    <PrimeToast :position='toastPosition'></PrimeToast>
    <div class='h-full w-full'>
        <NavBar />
        <RouterView :key="$route.fullPath" />
    </div>
</template>

<style scoped>
.app-wrapper {
    height: 100%;
    min-height: 100%;
    width: 100%;
}

header {
  line-height: 1.5;
}

nav {
  width: 100%;
  text-align: center;
  margin-top: 2rem;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        justify-content: flex-end;
    }
}

</style>
