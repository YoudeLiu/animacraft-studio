<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { onMounted, ref } from 'vue'
import animationMachine from './anim/FSM/animationMachine'
import { useMachine } from '@xstate/vue'

// For a proper setup, augment Window in a .d.ts file and configure tsconfig.json for Vite.

//const animatedBox = ref<HTMLDivElement | null>(null);



const { snapshot, send, actorRef } = useMachine(animationMachine);

onMounted(() => {
  // Conditional check for Vite's dev mode
  // For proper typing, ensure tsconfig.json includes "vite/client" in types 
  // and module is set to "ESNext" or similar.
  let isDevMode = false;
  // try {
  //   // This might still cause a linter warning if tsconfig.module is not ESNext/ES2020+
  //   // but wrapping in try/catch can prevent runtime errors if import.meta is truly undefined.
  //   if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
  //     isDevMode = (import.meta as any).env.DEV;
  //   }
  // } catch (e) {
  //   console.warn("Could not determine dev mode from import.meta.env, assuming not dev for __ANIMACRAFT_STUDIO__ exposure.");
  // }

  if (isDevMode) { // Check if we could determine dev mode
    const studio = (window as any).__ANIMACRAFT_STUDIO__;
    if (studio) {
        console.log("Exposing XState actorRef for AnimaCraft Studio");
        (window as any).__ANIMACRAFT_STUDIO__ = (window as any).__ANIMACRAFT_STUDIO__ || {};
        
        if (typeof (window as any).__ANIMACRAFT_STUDIO__.registerXStateService !== 'function') {
            (window as any).__ANIMACRAFT_STUDIO__.registerXStateService = (name: string, serviceInstance: any) => {
                (window as any).__ANIMACRAFT_STUDIO__[name] = serviceInstance;
                console.log(`XState service '${name}' registered for AnimaCraft Studio.`);
            };
        }
        (window as any).__ANIMACRAFT_STUDIO__.registerXStateService('appAnimation', actorRef);
    } else {
        // console.log("__ANIMACRAFT_STUDIO__ not found on window, not exposing XState actorRef.");
    }
  }

  //if (animatedBox.value) {
    // Initial visual state should be set by the first entry action of the "LEFT" state.
  //}
  console.log("onMounted: Initial machine snapshot value:", snapshot.value.value);
});

</script>

<template>
  <div class="main-container">
    <div class="logo-container">
      <a href="https://vite.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <HelloWorld msg="Vite + Vue + GSAP + XState - LEFT/RIGHT Toggle" />

    <div class="box-to-animate">
      Animate Me!
    </div>

    <div class="controls">
      <p>Current State: <strong>{{ snapshot.value }}</strong></p>
      <button @click="send({ type: 'TOGGLE' })">
        {{ snapshot.matches('LEFT') ? 'Animate to Right' : 'Animate to Left' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.logo-container {
  margin-bottom: 2em;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.box-to-animate {
  width: 100px;
  height: 100px;
  background-color: dodgerblue; /* Initial color, will be set by state entry */
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2em;
  margin-bottom: 1em; 
  border-radius: 10px;
  /* position: relative; */ /* Might be needed if x is not transform-based */
}

.controls {
  margin-top: 1em;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.controls button {
  padding: 0.5em 1em;
  font-size: 1em;
  cursor: pointer;
}
</style>
