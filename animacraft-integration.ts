/**
 * @file animacraft-integration.ts
 * This script facilitates two-way communication between GSAP animations on a webpage
 * and the 'animacraft-studio' Chrome extension.
 * 
 * Responsibilities:
 * 1. Detect if the 'animacraft-studio' extension is present.
 * 2. Collect and serialize data from all GSAP animations running on the page.
 * 3. Send this data to the extension for visualization and editing.
 * 4. Listen for messages from the extension to apply changes (e.g., seek, update vars)
 *    to GSAP animations.
 *
 * For the extension to be detected, it must:
 * 1. Set `window.animacraftStudioReady = true;`
 * 2. Optionally, dispatch a custom event: `document.dispatchEvent(new CustomEvent('animacraftStudioReady'));`
 *    (The script listens for this event if the flag isn't set on initial load).
 */

// Extend Window interface for custom properties
declare global {
  interface Window {
    animacraftStudioReady?: boolean;
    gsap?: any; // Using 'any' as GSAP types are bundled with GSAP itself.
    postMessage(message: any, targetOrigin: string, transfer?: Transferable[]): void; // Ensure postMessage is well-defined
  }
}

console.log("Animacraft integration script loaded.");

/**
 * Checks if the Animacraft Studio extension is ready.
 * The extension should signal its presence by:
 * 1. Setting `window.animacraftStudioReady = true;`
 * 2. Optionally, dispatching `new CustomEvent('animacraftStudioReady')` if it loads after the page script.
 */
function isAnimacraftStudioPresent(): boolean {
  if (window.animacraftStudioReady === true) {
    console.log("Animacraft Studio extension IS detected.");
    return true;
  } else {
    // console.log("Animacraft Studio extension NOT detected."); // Keep console cleaner
    return false;
  }
}

// --- GSAP Data Collection Logic ---

let nextAnimationId: number = 0;
const animationMap: Map<string, any> = new Map(); // Store GSAP objects by our ID

// Function to get or assign a unique ID to a GSAP animation object
function getAnimationId(anim: any): string | null {
  if (!anim) return null;
  for (const [id, mappedAnim] of animationMap) {
    if (mappedAnim === anim) {
      return id;
    }
  }
  const newId = `gsap_anim_${nextAnimationId++}`;
  animationMap.set(newId, anim);
  return newId;
}

// Interface for serialized animation data
interface SerializedAnimation {
  id: string | null;
  type: 'timeline' | 'tween';
  targets: string[];
  vars: any;
  startTime: number;
  duration: number;
  totalDuration: number;
  progress: number;
  totalProgress: number;
  time: number;
  totalTime: number;
  isActive: boolean;
  isReversed: boolean;
  isPaused: boolean;
  children?: (SerializedAnimation | null)[];
}

// Function to serialize a single GSAP animation
function serializeAnimation(anim: any): SerializedAnimation | null {
  if (!anim) return null;

  const id = getAnimationId(anim);
  const type = anim.hasOwnProperty('getChildren') ? 'timeline' : 'tween';

  let targets: string[] = [];
  if (anim.targets) {
    targets = anim.targets().map((t: any) => {
      if (typeof t === 'string') return t;
      if (t.id) return `#${t.id}`;
      if (t.className && typeof t.className === 'string') return `.${t.className.split(' ').join('.')}`;
      return t.tagName || 'unknown-target';
    });
  }
  
  let serializableVars: any = {};
  if (anim.vars) {
    for (const key in anim.vars) {
      if (Object.prototype.hasOwnProperty.call(anim.vars, key)) {
        const value = anim.vars[key];
        if (typeof value !== 'function' && typeof value !== 'object' || value === null) {
          serializableVars[key] = value;
        } else if (Array.isArray(value)) {
          try {
            serializableVars[key] = JSON.parse(JSON.stringify(value));
          } catch (e) {
            serializableVars[key] = "[Array serialization error]";
          }
        } else if (typeof value === 'object' && value.constructor === Object) {
           try {
             serializableVars[key] = JSON.parse(JSON.stringify(value));
           } catch (e) {
             serializableVars[key] = "[Circular or Complex Object]";
           }
        }
      }
    }
  }

  const data: SerializedAnimation = {
    id: id,
    type: type,
    targets: targets,
    vars: serializableVars,
    startTime: anim.startTime(),
    duration: anim.duration(),
    totalDuration: anim.totalDuration(),
    progress: anim.progress(),
    totalProgress: anim.totalProgress(),
    time: anim.time(),
    totalTime: anim.totalTime(),
    isActive: anim.isActive(),
    isReversed: anim.reversed(),
    isPaused: anim.paused(),
  };

  if (type === 'timeline') {
    data.children = anim.getChildren(true, true, true).map((child: any) => serializeAnimation(child)).filter((c: SerializedAnimation | null) => c !== null);
  }

  return data;
}

interface SerializedGSAPData {
  timestamp: string;
  globalTimeline: {};
  animations: (SerializedAnimation | null)[];
  error?: string;
  message?: string;
}

// Function to get and serialize all GSAP animations
function getAndSerializeAllGSAPData(): string | null {
  if (typeof window.gsap === 'undefined') {
    console.warn("GSAP is not loaded. Cannot collect animation data.");
    return null;
  }
  const gsap = window.gsap;

  const globalTimeline = gsap.globalTimeline;
  const allAnimations: any[] = globalTimeline.getChildren(true, true, true);

  const serializedData: SerializedGSAPData = {
    timestamp: new Date().toISOString(),
    globalTimeline: {},
    animations: allAnimations.map(anim => serializeAnimation(anim)).filter(a => a !== null)
  };
  
  try {
    return JSON.stringify(serializedData, null, 2);
  } catch (error: any) {
    console.error("Error serializing GSAP data:", error);
    return JSON.stringify({ error: "Serialization failed", message: error.message });
  }
}

// --- End GSAP Data Collection Logic ---

// --- Communication with Extension (Outgoing) ---

const MESSAGE_TYPE_GSAP_UPDATE = "GSAP_TIMELINE_UPDATE";
const MESSAGE_SOURCE_PAGE_SCRIPT = "gsap-page-script";

/**
 * Sends serialized GSAP animation data to the Animacraft Studio extension.
 * Message format:
 * {
 *   type: "GSAP_TIMELINE_UPDATE", // Identifies the message type
 *   payload: SerializedGSAPData, // The serialized animation data object
 *   source: "gsap-page-script"    // Identifies the sender
 * }
 */
function sendDataToExtension(jsonData: string): void {
  if (!isAnimacraftStudioPresent()) {
    return;
  }
  try {
    const parsedData = JSON.parse(jsonData); 
    window.postMessage({ 
      type: MESSAGE_TYPE_GSAP_UPDATE, 
      payload: parsedData, 
      source: MESSAGE_SOURCE_PAGE_SCRIPT 
    }, "*"); 
  } catch (error) {
    console.error("Failed to send data to extension. Invalid JSON string provided.", error);
  }
}

function sendInitialSnapshot(): void {
  if (typeof window.gsap === 'undefined') {
    console.warn("GSAP not loaded. Cannot send initial snapshot.");
    return;
  }
  console.log("Attempting to send initial GSAP data snapshot to extension...");
  const allDataJson = getAndSerializeAllGSAPData(); 
  if (allDataJson) {
    sendDataToExtension(allDataJson);
  } else {
    console.warn("Initial GSAP data snapshot was empty or failed to serialize.");
  }
}

// --- End Communication with Extension (Outgoing) ---

// --- Incoming Message Handling from Extension ---

const MESSAGE_SOURCE_EXTENSION = "animacraft-studio-extension"; // Expected source from extension

interface BaseMessagePayload {
  animationId: string;
}

interface SeekPayload extends BaseMessagePayload {
  time: number;
}

interface UpdateVarPayload extends BaseMessagePayload {
  varName: string;
  varValue: any;
}

// Type guard for SeekPayload
function isSeekPayload(payload: any): payload is SeekPayload {
  return payload && typeof payload.animationId === 'string' && typeof payload.time === 'number';
}

// Type guard for UpdateVarPayload
function isUpdateVarPayload(payload: any): payload is UpdateVarPayload {
  return payload && typeof payload.animationId === 'string' && typeof payload.varName === 'string' && payload.hasOwnProperty('varValue');
}

function handleSeekAnimation(payload: SeekPayload): void {
  if (!window.gsap) return;
  const anim = animationMap.get(payload.animationId);
  if (anim) {
    console.log(`Seeking animation ${payload.animationId} to ${payload.time}`);
    anim.seek(payload.time);
    // Optionally, trigger an immediate update back to the extension
    // onGSAPUpdate(); // Or a specific "acknowledge change" message
  } else {
    console.warn(`Animation with ID ${payload.animationId} not found for seek.`);
  }
}

function handleUpdateAnimationVar(payload: UpdateVarPayload): void {
  if (!window.gsap) return;
  const anim = animationMap.get(payload.animationId);
  if (anim) {
    console.log(`Updating var ${payload.varName} for animation ${payload.animationId} to`, payload.varValue);
    anim.vars[payload.varName] = payload.varValue;
    anim.invalidate().restart(); // This re-runs the animation with the new vars.
                                 // For some var changes, a different approach might be needed.
    // Optionally, trigger an immediate update back to the extension
    // onGSAPUpdate(); 
  } else {
    console.warn(`Animation with ID ${payload.animationId} not found for var update.`);
  }
}

/**
 * Handles messages received from the Animacraft Studio extension.
 * Expected message format from the extension:
 * {
 *   source: "animacraft-studio-extension", // Identifies the sender
 *   type: "ACTION_TYPE",                  // e.g., "GSAP_SEEK_ANIMATION", "GSAP_UPDATE_VAR"
 *   payload: { ... }                      // Action-specific data
 * }
 * 
 * Example Payloads:
 * For "GSAP_SEEK_ANIMATION":
 * { animationId: "gsap_anim_1", time: 1.5 }
 * 
 * For "GSAP_UPDATE_VAR":
 * { animationId: "gsap_anim_2", varName: "duration", varValue: 3 }
 * { animationId: "gsap_anim_3", varName: "x", varValue: 200 }
 */
function handleIncomingExtensionMessage(event: MessageEvent): void {
  // Basic security: Check if the message is from a known source (the extension's content script)
  if (!event.data || event.data.source !== MESSAGE_SOURCE_EXTENSION) {
    // console.log("Message ignored: not from animacraft-studio-extension", event.data); // Can be noisy
    return;
  }

  const { type, payload } = event.data;
  console.log(`Received message from extension: type=${type}`, payload);

  switch (type) {
    case "GSAP_SEEK_ANIMATION":
      if (isSeekPayload(payload)) {
        handleSeekAnimation(payload);
      } else {
        console.warn("Invalid payload for GSAP_SEEK_ANIMATION:", payload);
      }
      break;
    case "GSAP_UPDATE_VAR":
      if (isUpdateVarPayload(payload)) {
        handleUpdateAnimationVar(payload);
      } else {
        console.warn("Invalid payload for GSAP_UPDATE_VAR:", payload);
      }
      break;
    default:
      console.warn(`Unknown message type received from extension: ${type}`);
  }
}

// --- End Incoming Message Handling from Extension ---


// --- GSAP Update Hooking Logic ---

const THROTTLE_INTERVAL_MS: number = 250;
let throttledSendGSAPData: (() => void) | null = null;

function onGSAPUpdate(): void {
  const allDataJson = getAndSerializeAllGSAPData(); 
  if (allDataJson) {
    sendDataToExtension(allDataJson); 
  }
}

function setupGSAPHooks(): void {
  if (typeof window.gsap === 'undefined' || !window.gsap.globalTimeline || !window.gsap.utils || !window.gsap.utils.throttle) {
    console.warn("GSAP or GSAP utilities not fully available. Cannot setup update hooks.");
    return;
  }
  const gsap = window.gsap;

  if (!throttledSendGSAPData) {
    throttledSendGSAPData = gsap.utils.throttle(onGSAPUpdate, THROTTLE_INTERVAL_MS);
  }

  gsap.globalTimeline.eventCallback("onUpdate", throttledSendGSAPData);
  console.log("GSAP global timeline 'onUpdate' hook configured with throttling.");
}

function removeGSAPHooks(): void {
  if (typeof window.gsap === 'undefined' || !window.gsap.globalTimeline) {
    return;
  }
  const gsap = window.gsap;

  if (throttledSendGSAPData) {
    gsap.globalTimeline.eventCallback("onUpdate", null); 
    console.log("GSAP global timeline 'onUpdate' hook removed.");
  }
}
// --- End GSAP Update Hooking Logic ---

// Initialize synchronization
function initializeAnimacraftSync(): void {
  if (isAnimacraftStudioPresent()) {
    console.log("Initializing GSAP data synchronization with Animacraft Studio...");
    if (typeof window.gsap === 'undefined') {
      console.warn("GSAP is not loaded. Synchronization cannot start.");
      return;
    }
    
    sendInitialSnapshot(); 
    setupGSAPHooks();    

    // Add message listener for commands from the extension
    window.addEventListener("message", handleIncomingExtensionMessage, false);
    console.log("Added event listener for messages from Animacraft Studio extension.");

  } else {
    document.addEventListener('animacraftStudioReady', () => {
      console.log("Animacraft Studio extension became ready after page load.");
      window.animacraftStudioReady = true; 
      initializeAnimacraftSync(); 
    }, { once: true });
    console.log("Will listen for 'animacraftStudioReady' event in case extension loads later."); // Restored this log
  }
}

// Initial call
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAnimacraftSync);
} else {
  initializeAnimacraftSync();
}
