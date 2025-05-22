import { gsap } from 'gsap'

export default function left2Right() {
    const ret = gsap.timeline();
    ret.to('.box-to-animate', {
        duration: 3,
        ease: "power2.inOut",
        x: 200,
        backgroundColor: "#8a2be2", // Color for RIGHT state
    });

    return ret;
}