import { describe, it, expect, vi } from 'vitest';

// Mock all dependencies before importing the component
vi.mock('@/stores/useAuthStore', () => ({
  useAuthStore: () => ({
    user: { value: null },
    isGuestMode: { value: false },
    logOut: vi.fn(),
    disableGuestMode: vi.fn(),
  })
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  })
}));

vi.mock('../../utils/helper', () => ({
  clearAllStoredData: vi.fn(),
}));

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn(),
    remove: vi.fn(),
    removeGroup: vi.fn(),
    clear: vi.fn(),
  })
}));

// Mock PrimeVue components
vi.mock('primevue', () => ({
  Menu: { name: 'Menu' },
  Button: { name: 'Button' },
}));

describe('NavBar', () => {
    it('should be importable', async () => {
        const NavBar = await import('../../components/navBar/NavBar.vue');
        expect(NavBar.default).toBeDefined();
    });
});
