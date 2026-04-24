<template>
    <div id="login-page" class="flex flex-col justify-center items-center h-full w-full">
        <h1 class="text-emerald-500 text-2xl">Cleachtadh Gaeilge</h1>
        <span class="text-xl">
            {{ isRegisterView ? 'Create a new user' : 'Sign in' }}
        </span>
        <form
            id="login-form"
            class="flex flex-wrap justify-center items-end gap-4 p-6 sm:full md:w-1/2 lg:w-1/2 xl:w-1/2"
        >
            <div v-if="isRegisterView" class="w-full">
                <label for="username">Username</label>
                <input
                    class="w-full bg-mute-standard text-xl rounded p-2 border border-emerald-600 active:border-emerald-400 focus:border-emerald-400 focus:ring-0 focus:outline-emerald-400"
                    id="username"
                    v-model="username"
                    aria-describedby="username-help"
                />
            </div>

            <div class="w-full">
                <label for="email">Email</label>
                <input
                    class="w-full bg-mute-standard text-xl rounded p-2 border border-emerald-600 active:border-emerald-400 focus:border-emerald-400 focus:ring-0 focus:outline-emerald-400"
                    id="email"
                    v-model="email"
                    aria-describedby="email-help"
                />
            </div>

            <div class="w-full">
                <label for="password">Password</label>
                <div class="relative">
                    <input
                        :type="showPassword ? 'text' : 'password'"
                        class="w-full bg-mute-standard text-xl rounded p-2 border border-emerald-600 active:border-emerald-400 focus:border-emerald-400 focus:ring-0 focus:outline-emerald-400"
                        id="password"
                        v-model="password"
                        aria-describedby="password-help"
                    />
                    <button
                        type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2"
                        @click="togglePasswordVis"
                    >
                        <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                    </button>
                </div>
            </div>

            <PrimeMessage size="small" severity="error" variant="simple">
                {{ errorMessage }}
            </PrimeMessage>

            <div class="w-full flex flex-wrap flex-col items-center gap-2">
                <PrimeButton
                    v-if="!isRegisterView"
                    type="submit"
                    severity="secondary"
                    label="Login"
                    class="btn-primary p-2 text-sm hover:bg-emerald-700 hover:border-emerald-700"
                    @click="logIn"
                />
                <PrimeButton
                    v-if="isRegisterView"
                    type="submit"
                    severity="secondary"
                    label="Sign Up"
                    class="btn-primary p-2 text-sm hover:bg-emerald-700 hover:border-emerald-700"
                    @click="signUp"
                />

                <button
                    type="button"
                    class="p-2 text-sm hover:text-white hover:border-emerald-700 underline"
                    @click="toggleRegisterView"
                >
                    {{ toggleText }}
                </button>

                <PrimeButton
                    v-tooltip.bottom="'Explore features of the app without logging in'"
                    type="button"
                    severity="secondary"
                    label="Continue as guest"
                    class="btn-secondary p-2 text-sm"
                    data-testid="login-continue-guest"
                    @click="continueAsGuest"
                />
            </div>
        </form>
        <RouterLink
            to="/docs/overview"
            class="mt-6 text-emerald-400/90 text-sm underline hover:text-emerald-300"
            data-testid="login-link-docs"
        >
            Documentation
        </RouterLink>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';

const toast = useToast();
const router = useRouter();
const authStore = useAuthStore();

const isRegisterView = ref<boolean>(false);

const username = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');
const showPassword = ref<boolean>(false);
const errorMessage = ref<string>('');

const logIn = async (e: Event): Promise<void> => {
    e.preventDefault();
    errorMessage.value = '';
    if (email.value.length > 0 && password.value.length > 0) {
        try {
            await authStore.logIn(email.value, password.value);
            toast.add({ severity: 'success', summary: `Logged in as ${email.value}.`, life: 3000 });
            router.push('/');
        } catch (err) {
            toast.add({ severity: 'error', summary: `Failed to login.`, life: 3000 });
            errorMessage.value = err as string;
        }
    } else {
        errorMessage.value = 'Enter your email address and password.';
    }
};

const signUp = async (e: Event): Promise<void> => {
    e.preventDefault();
    errorMessage.value = '';
    if (username.value.length > 0 && email.value.length > 0 && password.value.length > 0) {
        try {
            await authStore.signUp(username.value, email.value, password.value);
            toast.add({
                severity: 'success',
                summary: `Welcome new user ${username.value}.`,
                life: 3000
            });
            router.push('/');
        } catch (err) {
            toast.add({ severity: 'error', summary: `Failed to create a new user.`, life: 3000 });
            errorMessage.value = err as string;
        }
    } else {
        errorMessage.value = 'Enter your email address and password.';
    }
};

const togglePasswordVis = (): void => {
    showPassword.value = !showPassword.value;
};

const toggleRegisterView = (): void => {
    isRegisterView.value = !isRegisterView.value;
};

const continueAsGuest = (): void => {
    authStore.enableGuestMode();
    router.push('/');
};

const toggleText = computed(() => {
    return isRegisterView.value ? 'Sign in with existing user' : 'Create a new user';
});
</script>
