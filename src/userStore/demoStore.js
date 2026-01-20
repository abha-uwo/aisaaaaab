import { atom } from 'recoil';

export const demoModalState = atom({
    key: 'demoModalState',
    default: {
        isOpen: false,
        selectedAgent: null,
    },
});
