import { gsap } from 'gsap'

export default function right2Left() {
    const ret = gsap.timeline();
    ret.to('.box-to-animate', {
        duration: 3,
        ease: "power2.inOut",
        x: 0,
        backgroundColor: "dodgerblue", // Color for LEFT state
    });

    return ret;
}