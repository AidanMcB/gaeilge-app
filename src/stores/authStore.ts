import type { User } from '@/ts/user';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore("useAuthStore", () => {
    const user = ref<User>();

    return {
        user
    }

})
