declare global {
    interface Window {
        PhysJs: any;
        Vec3: any;
    }
}

import PhysJs from './PhysJs'

window.PhysJs = PhysJs;
window.Vec3 = PhysJs.Vec;

export default PhysJs