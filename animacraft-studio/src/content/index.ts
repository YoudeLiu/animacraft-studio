// 注入到页面的脚本
console.log('AnimaCraft Studio content script loaded')

// 监听来自 DevTools 面板的消息
const port = chrome.runtime.connect({ name: 'content' })

port.onMessage.addListener((message) => {
  console.log('Content script received message:', message)
  // 这里将来会添加消息处理逻辑
})

// 检测页面中的 GSAP 和 XState 实例
function detectInstances() {
  const instances = {
    gsap: {
      timelines: [],
      tweens: []
    },
    xstate: {
      machines: []
    }
  }

  // 检测 GSAP 实例
  if (window.gsap) {
    // 这里将来会添加 GSAP 实例检测逻辑
  }

  // 检测 XState 实例
  if (window.__ANIMACRAFT_STUDIO__?.xstate) {
    // 这里将来会添加 XState 实例检测逻辑
  }

  return instances
}

// 定期检测实例
setInterval(() => {
  const instances = detectInstances()
  port.postMessage({
    type: 'instances',
    data: instances
  })
}, 1000) 