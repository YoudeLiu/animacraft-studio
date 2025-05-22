// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message)
  // 这里将来会添加消息处理逻辑
  sendResponse({ success: true })
})

// 监听来自 DevTools 面板的消息
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'devtools') {
    port.onMessage.addListener((message) => {
      console.log('Background received message from DevTools:', message)
      // 这里将来会添加消息处理逻辑
    })
  }
}) 