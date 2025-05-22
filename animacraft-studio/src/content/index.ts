console.log('AnimaCraft Studio content script loaded')

// 注入到页面的脚本
const s = document.createElement('script')
s.type = 'text/javascript'
s.src = chrome.runtime.getURL('inject.js')
s.onload = function () {
  if (s.parentNode) {
    s.parentNode.removeChild(s)
  }
}
;(document.head || document.documentElement).appendChild(s)


// 重新声明或确保 window.gsap 和 window.__ANIMACRAFT_STUDIO__ 在此作用域内可识别
// 通常通过在 src/types/global.d.ts 中定义

// GSAPTimeline 和 GSAPTween 接口应在 types/global.d.ts 或特定类型文件中唯一定义
// 此处不再重复定义，假设它们已在全局或通过模块导入可用
let port: chrome.runtime.Port | null = null;
let updateInterval: number | null = null;

function getElementSelector(element: any): string {
  if (!element || typeof element.tagName !== 'string') return 'unknown (not an element)';
  if (element.id) return `#${element.id}`;
  let selector = element.tagName.toLowerCase();
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.trim().split(/\s+/).filter(Boolean);
    if (classes.length > 0) {
      selector += `.${classes.join('.')}`;
    }
  }
  // 为了简化，这里不生成过于复杂的选择器，如 nth-child 等
  // 对于更精确的非ID/类选择器，可能需要更复杂的逻辑
  return selector;
}

function serializeTimeline(timeline: GSAPTimeline): any {
  return {
    id: timeline.vars.id || `timeline_${Math.random().toString(36).substr(2, 9)}`,
    duration: typeof timeline.duration === 'function' ? timeline.duration() : 0,
    progress: typeof timeline.progress === 'function' ? timeline.progress() : 0,
    isActive: typeof timeline.isActive === 'function' ? timeline.isActive() : false,
    vars: { ...timeline.vars },
    // children: timeline.getChildren(true, true, true).map(child => {
    //   if ('getChildren' in child) return serializeTimeline(child as GSAPTimeline);
    //   return serializeTween(child as GSAPTween);
    // }),
  };
}

function serializeTween(tween: GSAPTween): any {
  return {
    id: tween.vars.id || `tween_${Math.random().toString(36).substr(2, 9)}`,
    targets: tween.targets().map(t => getElementSelector(t)),
    duration: tween.duration(),
    progress: tween.progress(),
    isActive: typeof tween.isActive === 'function' ? tween.isActive() : false,
    vars: { ...tween.vars },
  };
}

// 检测页面中的 GSAP 和 XState 实例
function detectInstances() {
  const instances = {
    gsap: {
      timelines: [] as any[],
      tweens: [] as any[]
    },
    xstate: {
      machines: [] as any[]
    }
  };

  // 检测 GSAP 实例
  if (window.gsap?.globalTimeline) {
    const rootItems = window.gsap.globalTimeline.getChildren(true, true, true);
    rootItems.forEach(item => {
      if ('getChildren' in item && typeof (item as any).getChildren === 'function') {
        instances.gsap.timelines.push(serializeTimeline(item as GSAPTimeline));
      } else if (typeof (item as any).targets === 'function') {
        instances.gsap.tweens.push(serializeTween(item as GSAPTween));
      }
    });
  }
  // 你可以在这里添加更多 GSAP 实例的检测逻辑，比如 getTweensOf(document.body) 等

  // 检测 XState 实例 (保持原有逻辑)
  // if (window.__ANIMACRAFT_STUDIO__?.xstate?.machines) {
  //   try {
  //     instances.xstate.machines = JSON.parse(JSON.stringify(window.__ANIMACRAFT_STUDIO__.xstate.machines));
  //   } catch (error) {
  //     console.error('Content script: Error serializing XState machines:', error);
  //     instances.xstate.machines = []; // Fallback to empty array on error
  //   }
  // }
  // console.log('Detected instances:', instances);
  return instances;
}

function connectAndSetupPort() {
  if (port) { // 如果旧的 port 存在，尝试断开（尽管它可能已经失效）
    try { port.disconnect(); } catch (e) { /* ignore */ }
    port = null;
  }
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }

  console.log('Content script: Attempting to connect to background...');
  port = chrome.runtime.connect({ name: 'content-script' });

  port.onMessage.addListener((message) => {
    // console.log('Content script: Received message from background:', message);
    if (!port) return; // 如果在消息处理过程中 port 断开了

    if (message.type === 'CONTROL_ANIMATION') {
      const { animationId, action, value } = message.payload;
      const anim = gsap.getById(animationId);
      if (anim) {
        switch (action) {
          case 'play': (anim as any).play(); break;
          case 'pause': (anim as any).pause(); break;
          case 'progress': (anim as any).progress(value); break;
          // 可以添加更多控制命令，如 seek, reverse, timeScale 等
        }
        try {
          port.postMessage({ type: 'INSTANCES_DATA', payload: detectInstances() });
        } catch (e) { console.warn('Content script: Error sending post-control update:', e); }
      }
    } else if (message.type === 'REQUEST_INSTANCES_DATA') {
      try {
        port.postMessage({ type: 'INSTANCES_DATA', payload: detectInstances() });
      } catch (e) { console.warn('Content script: Error sending requested instances data:', e); }
    }
  });

  port.onDisconnect.addListener(() => {
    console.warn('Content script: Port disconnected from background. Clearing interval and port reference.');
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
    port = null;
    // 可选择在这里添加延迟重连逻辑，例如:
    // setTimeout(connectAndSetupPort, 5000); 
  });

  // 初始发送数据
  try {
    if (port) { // 确保 port 仍然连接
        port.postMessage({ type: 'INSTANCES_DATA', payload: detectInstances() });
    }
  } catch(e) {
    console.warn('Content script: Error sending initial INSTANCES_DATA:', e);
  }
  
  // 启动定期更新
  updateInterval = setInterval(() => {
    if (!port) { // 如果 port 断开，则停止 interval
      // console.warn('Content script: Port is disconnected, stopping updates.');
      if (updateInterval) clearInterval(updateInterval);
      updateInterval = null;
      return;
    }
    try {
      port.postMessage({
        type: 'INSTANCES_DATA',
        payload: detectInstances()
      });
    } catch (error) {
      console.warn('Content script: Error sending periodic INSTANCES_DATA:', error);
      if ((error as Error).message.includes('disconnected port') || (error as Error).message.includes('Extension context invalidated')) {
        if (updateInterval) clearInterval(updateInterval);
        updateInterval = null;
        if(port) { try { port.disconnect(); } catch(e){/*ignore*/} }
        port = null; 
      }
    }
  }, 5000); // 更新频率调整为5秒
}

// 初始连接
connectAndSetupPort();

window.addEventListener('unload', () => {
  console.log('Content script: Unload event triggered.');
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
  if (port) {
    try { port.disconnect(); } catch (e) { /* ignore */ }
    port = null;
  }
});

document.addEventListener('animacraft-studio.updateGSAP', (event: any) => {
  console.log('Content script: animacraft-studio.updateGSAP event triggered.');
  port?.postMessage(event.detail)
});
console.log('AnimaCraft Studio content script (with robust port handling) loaded and listening.'); 