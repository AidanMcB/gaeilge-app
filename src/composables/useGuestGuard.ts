import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/useAuthStore';

/**
 * Whether the user may access routes that require auth or guest mode.
 */
export function useGuestGuard() {
    const authStore = useAuthStore();
    const { user, isGuestMode } = storeToRefs(authStore);

    const canAccessApp = computed(
        () => (!!user.value && authStore.isAuthenticated) || isGuestMode.value
    );

    return { canAccessApp, user, isGuestMode };
}
