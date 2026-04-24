<script lang='ts' setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/useAuthStore';
import { storeToRefs } from 'pinia';

const route = useRoute();
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
});

onUnmounted(() => {
    window.removeEventListener('resize', updatePosition);
});

const isLoginPage = computed(() => route.path === '/login');
const isDocsPage = computed(() => route.path.startsWith('/docs'));

const showNavBar = computed(() => {
    if (isLoginPage.value) return false;
    if (isDocsPage.value) return true;
    return (user.value || authStore.isGuestMode) && !loadingAuth.value;
});
</script>

<template>
    <PrimeToast :position='toastPosition'></PrimeToast>
    <NavBar v-if='showNavBar'/>
    <main
        class="flex-grow p-2 sm:p-3"
        :class="[
            showNavBar
                ? isDocsPage
                    ? 'min-h-[calc(100vh-50px)] pt-[52px] sm:min-h-[calc(100vh-60px)] sm:pt-[60px]'
                    : 'h-[calc(100vh-50px)] pt-[52px] sm:h-[calc(100vh-60px)] sm:pt-[60px]'
                : isDocsPage
                    ? 'min-h-screen'
                    : 'h-screen'
        ]"
    >
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
