<template>
    <div
        class="navbar fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 py-2 sm:py-3 bg-black/80 backdrop-blur-sm border-b border-gray-800/50 flex items-center justify-between shadow-lg overflow-visible"
        role="navigation"
    >
        <!-- Guest Mode Indicator -->
        <div v-if="isGuestMode" class="flex items-center gap-2 text-amber-400 text-sm">
            <i class="pi pi-user text-xs"></i>
            <span class="hidden sm:inline">Guest Mode</span>
        </div>
         
        <Button
            type="button"
            icon="pi pi-bars"
            @click="toggle"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            class="p-button-rounded p-button-text text-white hover:bg-white/10 transition-colors"
            :pt="{
                root: { class: ['!p-2 sm:!p-3'] },
                icon: { class: ['!text-lg sm:!text-xl'] }
            }"
        />
        <Menu
            ref="menu"
            id="overlay_menu"
            :model="menuItems"
            :popup="true"
            :pt="{
                root: {
                    class: 'bg-[#181818] rounded-lg border border-gray-600/30 shadow-lg py-2 min-w-[180px] sm:min-w-[200px]'
                },
                item: { class: 'px-1' },
                itemLink: { class: '!text-white hover:bg-gray-700/50 !py-2 sm:!py-3 !px-3 sm:!px-4' },
                separator: { class: 'border-t border-gray-700/50 my-2' },
                icon: { class: ['!text-sm sm:!text-base'] },
                label: { class: ['!text-sm sm:!text-base'] }
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
const { user, isGuestMode } = storeToRefs(authStore);
const menu = ref();

const router = useRouter();
const toast = useToast();

function onClickHome() {
    clearAllStoredData();
    router.push('/');
}

async function onClickLogout() {
    clearAllStoredData();
    try {
        if (isGuestMode.value) {
            authStore.disableGuestMode();
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Exited guest mode',
                life: 3000
            });
        } else {
            await authStore.logOut();
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Logged out successfully',
                life: 3000
            });
        }
        router.push('/login');
    } catch (error) {
        console.error('Failed to log out. Error: ', error);
    }
}

const toggle = (event: MouseEvent) => {
    menu.value.toggle(event);
};

const onClickModuleSelect = () => {
    router.push('/section-select');
}; 

const onClickNoteCards = () => {
    router.push('/notecards');
};

const menuItems = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        command: onClickHome
    },
    {
        label: isGuestMode.value ? 'Guest User' : (user?.value?.email || 'Profile'),
        icon: 'pi pi-user',
    },
    {
        label: 'Module Select',
        icon: 'pi pi-list',
        command: onClickModuleSelect
    },
    {
        label: 'Note Cards',
        icon: 'pi pi-book',
        command: onClickNoteCards
    },
    {
        separator: true
    },
    {
        label: isGuestMode.value ? 'Exit Guest Mode' : 'Logout',
        icon: 'pi pi-sign-out',
        class: 'text-red-400',
        command: onClickLogout
    },

]);
</script>

<style lang="scss">
.navbar {
    min-height: 50px;
    
    @media (min-width: 640px) {
        min-height: 60px;
    }
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

// Mobile-specific menu adjustments
@media (max-width: 640px) {
    :deep(.p-menu) {
        .p-menuitem-link {
            padding: 0.75rem 1rem !important;
        }
        
        .p-menuitem-icon {
            font-size: 1rem !important;
        }
        
        .p-menuitem-text {
            font-size: 0.875rem !important;
        }
    }
}
</style>
