import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NavBar from '../../components/NavBar.vue';

const homeLinkSelector = '[data-testid=home-link]'

const wrapper = mount(NavBar);

describe('NavBar', () => {

    it('renders properly', () => {
        expect(wrapper).toBeDefined();
    });

    it('has link to home page', () => {
        expect(wrapper.find(homeLinkSelector)).toBeDefined();
    });

});
