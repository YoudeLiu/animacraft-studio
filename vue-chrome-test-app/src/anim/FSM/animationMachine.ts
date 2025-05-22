import { setup } from "xstate";
import left2Right from "../gasp/left2Right";
import right2Left from "../gasp/right2Left";
const animationSetup = setup({
    types: {
      context: {} as {},
      events: {} as { type: "TOGGLE" },
      // If actions needed specific types for their event or context, define here
    },
    actions: {
      animateToLeftTarget: () => {
        console.log("ACTION: animateToLeftTarget");
        right2Left();
      },
      animateToRightTarget: () => {
        console.log("ACTION: animateToRightTarget");
        left2Right();
      },
    },
  });
  /** @xstate-layout N4IgpgJg5mDOIC5QEMB2BLAtsgLug9qgCr5RQA2YAdADICiAYkQMREDyA4h-QNoAMAXUSgADvljo8hYSAAeiAMx8+VAEwBWADQgAnogCMC1QF9j2tFlwFipCtQBKASQ4AJFuy69BMsRKmoZeQQlFQ1tPQQADn0qdVMzEFR8CDgZC2x-EjJKH3FJa0DEAFoANnDiktNzDAzrLLtaRiJcvwKkOUQAFlVyhABOBSo+SIVRsfGFTqqQdKtCesoqJ1dm9t986Xag7s7YkrDdRD71WJGJian4oA */
const animationMachine = animationSetup.createMachine({
    id: "animationToggle",
    initial: "LEFT",
    context: {},
    states: {
      LEFT: {
        entry: "animateToLeftTarget",
        on: {
          TOGGLE: {
            target: "RIGHT",
          },
        },
      },
      RIGHT: {
        entry: "animateToRightTarget",
        on: {
          TOGGLE: {
            target: "LEFT",
          },
        },
      },
    },
  });

  export default animationMachine;