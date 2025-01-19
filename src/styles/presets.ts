import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

export const StylePreset = definePreset(Aura, {
	components: {
		toggleswitch: {
			extend: {
				root: {
					myDisabledOpacity: '0.7',
				},
				handle: {
					myCheckedDisabledBackground: '{primary.color}',
				},
			},
		},
		css: ({ dt }: { dt: any }) => `
.p-toggleswitch.p-disabled .p-toggleswitch-slider {
    opacity: ${dt('toggleswitch.my.disabled.opacity')};
}

.p-toggleswitch.p-disabled .p-toggleswitch-handle {
    background: ${dt('toggleswitch.my.checked.disabled.background')};
}
`,
	},
});
