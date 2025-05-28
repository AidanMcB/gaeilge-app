<template>
    <div
        class="navbar h-min-[65px] fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-black/80 backdrop-blur-sm border-b border-gray-800/50 flex items-center justify-end shadow-lg overflow-visible"
        role="navigation"
    >
        <Button
            type="button"
            icon="pi pi-bars"
            @click="toggle"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            class="p-button-rounded p-button-text text-white"
        />
        <Menu
            ref="menu"
            id="overlay_menu"
            :model="menuItems"
            :popup="true"
            :pt="{
                root: {
                    class: 'bg-[#181818] rounded-lg border border-gray-600/30 shadow-lg py-2 min-w-[200px]'
                },
                item: { class: 'px-1' },
                itemLink: { class: '!text-white hover:bg-gray-700/50' },
                separator: { class: 'border-t border-gray-700/50 my-2' }
            }"
        />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { clearAllStoredData } from '../../utils/helper';
import { useAuthStore } from '@/stores/useAuthStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { Menu, Button, useToast } from 'primevue';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const menu = ref();

const router = useRouter();
const toast = useToast();

function onClickHome() {
    clearAllStoredData();
    router.push('/');
}

function onClickProfile() {
    // router.push('/profile');
    console.log('To Do: go to profile');
}

async function onClickLogout() {
    clearAllStoredData();
    try {
        await authStore.logOut();
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Logged out successfully',
            life: 3000
        });
        router.push('/');
    } catch (error) {
        console.error('Failed to log out. Error: ', error);
    }
}

const toggle = (event: MouseEvent) => {
    menu.value.toggle(event);
};

const menuItems = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        command: onClickHome
    },
    {
        label: user?.value?.email || 'Profile',
        icon: 'pi pi-user',
        command: onClickProfile
    },
    {
        separator: true
    },
    {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        class: 'text-red-400',
        command: onClickLogout
    }
]);
</script>

<style lang="scss">
.navbar {
    min-height: 60px;
}

.p-button.p-button-text:enabled:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

// Logout item special styling
:deep(.p-menu) .p-menuitem:last-child .p-menuitem-text {
    color: #f87171;
}
:deep(.p-menu) .p-menuitem:last-child .p-menuitem-link:hover .p-menuitem-text {
    color: #ef4444;
}
</style>
