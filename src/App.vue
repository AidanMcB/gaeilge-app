<script lang='ts' setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useAuthStore } from './stores/useAuthStore';
import { storeToRefs } from 'pinia';

const toastPosition = ref<string>(getPosition());
const authStore = useAuthStore();
const { user, loadingAuth } = storeToRefs(authStore);

function getPosition() {
    return window.innerWidth < 768 ? 'top-center' : 'top-right';
}

const updatePosition = () => {
    toastPosition.value = getPosition();
};

onMounted(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    // Watch for auth state changes
    watch([user, loadingAuth], ([newUser, isLoading]) => {
        console.log('Auth State:', { user: newUser, isLoading });
    });
});

onUnmounted(() => {
    window.removeEventListener('resize', updatePosition);
});

const isLoginPage = computed(() => {
    return window.location.pathname === '/login';
});

const showNavBar = computed(() => {
    return !isLoginPage.value && user.value && !loadingAuth.value;
});

</script>

<template>
    <PrimeToast :position='toastPosition'></PrimeToast>
    <NavBar v-if='showNavBar'/>
    <main class="flex-grow h-full p-2" :class="[showNavBar ? 'h-[calc(100vh-60px)] pt-[60px]' : 'h-screen']">
        <RouterView :key="$route.fullPath" />
    </main>
</template>

<style>
:root {
    --navbar-height: 60px;
}

.app-wrapper {
    min-height: 100vh;
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
