// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(GSDevTools); // 如果需要注册
    // Select the box element
    const box = document.querySelector(".animated-box");
    const box2 = document.querySelector(".animated-box2");
    let tl = gsap.timeline();
    // GSAP Animation
    tl.to(box, {
        duration: 2,          // Animation duration in seconds
        x: 200,               // Move 200px to the right (translateX)
        rotation: 360,        // Rotate 360 degrees
        scale: 1.5,           // Scale up by 50%
        backgroundColor: "#ff6347", // Change background color to tomato
        borderRadius: "50%",    // Change to a circle
        ease: "power2.inOut", // Easing function for smooth animation
        repeat: -1,           // Repeat indefinitely
        yoyo: true            // Play the animation back and forth
    });
    tl.to(box2, {
        duration: 2,          // Animation duration in seconds
        x: 200,               // Move 200px to the right (translateX)
        rotation: 360,        // Rotate 360 degrees
        scale: 1.5,           // Scale up by 50%
        backgroundColor: "#ff6347", // Change background color to tomato
        borderRadius: "50%",    // Change to a circle
        ease: "power2.inOut", // Easing function for smooth animation
        repeat: -1,           // Repeat indefinitely
        yoyo: true            // Play the animation back and forth
    });
    

    GSDevTools.create({animation: tl}); // 将特定的timeline附加到DevTools
}); 