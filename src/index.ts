declare global {
    interface Window {
        PhysJs: any;
    }
}

import PhysJs from './PhysJs'

window.PhysJs = PhysJs;

export default PhysJs