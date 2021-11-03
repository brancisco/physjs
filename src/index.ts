declare global {
    interface Window {
        PhysJs: any;
        Vec3: any;
        Quaternion: any;
    }
}

import PhysJs from './PhysJs'

window.PhysJs = PhysJs;
window.Vec3 = PhysJs.Vec;
window.Quaternion = PhysJs.Quaternion;

export default PhysJs