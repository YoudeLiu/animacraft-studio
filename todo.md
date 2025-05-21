# AnimaCraft Studio - 项目待办事项

## I. Chrome DevTools 插件 (AnimaCraft Studio) - 核心开发

### 1. UI 实现 (panel.html, panel.js, panel.css - 建议使用 Vue.js 或类似框架)

*   **XState 状态机查看器 UI**
    *   [ ] 实现状态机图形化展示 (状态节点、转换箭头)。
    *   [ ] 实现当前状态高亮功能。
    *   [ ] 展示状态机当前的上下文 (context) 数据。
    *   [ ] (可选) 支持缩放、拖拽查看复杂状态图。
*   **GSAP 动画可视化编辑器 UI**
    *   [ ] 列出从被审查页面检测到的 GSAP Timeline 实例。
    *   [ ] 实现 Timeline 时间轴展示和播放控件 (播放、暂停、停止、循环、播放速度控制)。
    *   [ ] 展示选定 Timeline 内的所有 Tween 实例列表。
    *   [ ] 为选定的 Tween 提供参数编辑界面：
        *   [ ] 目标元素选择器 (只读或可辅助选取)。
        *   [ ] 动画时长 (duration)。
        *   [ ] 缓动函数 (ease) 选择器 (预设列表或自定义输入)。
        *   [ ] 延迟 (delay)。
        *   [ ] 动画属性 (如 `x`, `y`, `opacity`, `scale`, `backgroundColor`) 及其目标值编辑。
        *   [ ] (可选) 颜色选择器、缓动函数曲线预览等辅助工具。
*   **GSAP 动画调试器 UI**
    *   [ ] 当鼠标悬停在 Timeline 或 Tween 列表项上时，在被审查页面高亮对应动画元素。
    *   [ ] 实现元素拾取器功能：允许用户在被审查页面点击元素，以快速定位或为其创建新动画。
*   **代码导出功能 UI**
    *   [ ] 允许用户选择一个或多个 GSAP Timeline。
    *   [ ] 提供导出按钮，将选定的 Timeline (及其 Tween) 生成为 JavaScript (GSAP) 代码。
    *   [ ] (可选) 导出代码的格式化和优化选项。
*   **整体布局和样式**
    *   [ ] 确保插件界面在 Elements 面板侧边栏中布局合理、美观易用。
    *   [ ] 考虑响应式设计，适应不同宽度的侧边栏。

### 2. 核心逻辑 (`panel.js` 或 Vue 组件逻辑)

*   **与 Content Script 通信**
    *   [ ] 建立 DevTools Panel 与 Content Script 之间的长连接 (`chrome.runtime.connect`)。
    *   [ ] 定义消息协议：
        *   Panel -> Content Script: 请求 GSAP/XState 实例、控制动画 (播放/暂停/跳转到特定时间)、修改 Tween 参数、请求元素拾取。
        *   Content Script -> Panel: 发送 GSAP/XState 实例数据、实例更新通知、当前动画状态、元素拾取结果。
*   **XState 状态机数据处理与同步**
    *   [ ] 从 Content Script 接收 XState 服务实例数据。
    *   [ ] 解析状态机定义 (状态、转换、事件) 并更新 UI。
    *   [ ] 实时监听（通过 Content Script）状态机状态变化和上下文更新，并反映到 UI。
*   **GSAP Timeline 数据处理与同步**
    *   [ ] 从 Content Script 接收 GSAP Timeline 实例及其 Tween 数据。
    *   [ ] 解析并展示 Timeline 和 Tween 信息。
    *   [ ] 当用户在 UI 中修改 Tween 参数时，通过 Content Script 发送指令到被审查页面实时更新动画。
    *   [ ] 实现通过 Content Script 控制 GSAP 动画的播放、暂停、时间调整等。
*   **元素拾取器逻辑**
    *   [ ] 向 Content Script 发送开启/关闭元素拾取的指令。
    *   [ ] 接收 Content Script 返回的选中元素信息，并用于填充动画目标或高亮。
*   **GSAP 代码生成逻辑**
    *   [ ] 根据 UI 中选定和编辑的 Timeline/Tween 数据，生成结构良好、可直接使用的 GSAP JavaScript 代码。

### 3. Content Script (`content_script.js` - 需要创建并配置)

*   [ ] **注入到被审查页面** (`manifest.json` 中配置 `content_scripts`)。
*   [ ] **访问页面中的 GSAP 和 XState 实例**
    *   [ ] 安全地访问 `window.__ANIMACRAFT_STUDIO__` 以获取暴露的 GSAP Timeline 和 XState 服务实例。
    *   [ ] (可选) 实现轮询或使用 MutationObserver 监听 `window.__ANIMACRAFT_STUDIO__` 的变化，以动态检测新实例。
*   **与 DevTools Panel 通信**
    *   [ ] 监听并响应来自 Panel 的消息请求。
    *   [ ] 主动向 Panel 发送检测到的实例信息和状态更新。
*   **操作页面中的 GSAP 实例**
    *   [ ] 根据 Panel 指令，直接调用 GSAP API (如 `.play()`, `.pause()`, `.time()`, `.tweenTo()`, 修改 tween 的 `vars` 并 `invalidate()`)。
*   **操作页面中的 XState 实例**
    *   [ ] 根据 Panel 指令，向 XState 服务发送事件 (`service.send(...)`)。
    *   [ ] 监听 XState 服务的状态转换 (`service.subscribe(...)`) 并将更新通知 Panel。
*   **实现元素拾取逻辑**
    *   [ ] 添加事件监听器 (如 `mouseover`, `click`) 到页面元素，以响应 Panel 的拾取请求。
    *   [ ] 获取被选中元素的唯一选择器 (如 ID, class, XPath) 并发送给 Panel。

### 4. Background Script (`background.js` - 可能需要创建)

*   [ ] 主要用于在某些复杂通信场景下协调 DevTools Panel 和 Content Script (如果直接通信不足够)。
*   [ ] (可选) 管理插件的全局设置或状态 (如使用 `chrome.storage.local`)。

### 5. Manifest 配置 (`manifest.json`)

*   [ ] 添加 `content_scripts` 声明，指定注入目标页面和 `content_script.js`。
*   [ ] 确保 `permissions` 包含 `"scripting"`, `"activeTab"` (如果需要操作当前标签页), `"storage"` (如果使用)。
*   [ ] (可选) 添加 `background` 脚本声明。
*   [ ] 更新插件图标 (`icons`) 和描述信息。

## II. Vue 测试项目 (`vue-chrome-test-app`) - 改进与扩展

### 1. 完善 `window.__ANIMACRAFT_STUDIO__` 接口

*   [ ] 确保 GSAP Timeline 实例 (例如，通过 `gsap.timeline({ id: "mainTimeline" })` 并暴露) 被正确、稳定地暴露。
*   [ ] 确保 XState 服务实例 (`animationService`) 被正确暴露。
*   [ ] 考虑一个页面中可能存在多个独立的动画模块和状态机，设计 `__ANIMACRAFT_STUDIO__` 接口以支持发现和管理多个实例 (例如，使用对象或数组聚合实例)。

### 2. TypeScript 类型定义与配置

*   [ ] 创建 `src/types/global.d.ts` (或类似文件) 为 `window.__ANIMACRAFT_STUDIO__` 提供准确的 TypeScript 类型声明。
*   [ ] 调整 `tsconfig.json` (如 `compilerOptions.types` 或 `include`) 以确保全局类型声明被识别。
*   [ ] 修正 `import.meta.env.DEV` 的类型问题，可能通过在 `tsconfig.json` 中添加 `vite/client` 到 `compilerOptions.types`，或创建自定义的 `env.d.ts`。

### 3. 创建更复杂的 GSAP 动画示例

*   [ ] 实现包含多个顺序和并行 Tween 的主 Timeline。
*   [ ] 使用不同的缓动函数 (如 `elastic`, `bounce`, 自定义 `cubic-bezier`)。
*   [ ] 添加动画回调函数 (`onStart`, `onComplete`, `onUpdate`)。
*   [ ] (可选) 创建基于滚动触发的动画 (GSAP ScrollTrigger)。

### 4. 创建更复杂的 XState 状态机示例

*   [ ] 引入嵌套状态 (hierarchical states)。
*   [ ] 引入并行状态 (parallel states)。
*   [ ] 使用延迟转换 (delayed transitions)、守卫条件 (guards)。
*   [ ] (可选) 引入 Actor 模型 (invoked/spawned actors)。

### 5. 代码质量与最佳实践

*   [ ] 恢复或确认 `animatedBox` 的 `ref` 定义与使用的方案 (目前是类选择器)。如果坚持类选择器，请确保其在复杂场景下的唯一性和稳定性。
*   [ ] 确保 `isDevMode` 的判断方式稳健，或根据 Vite 的标准方式 (`import.meta.env.DEV`) 正确配置类型。

## III. 设计、用户体验 (UX) 与测试

### 1. 原型图迭代

*   [ ] 根据开发过程中的实际情况和遇到的问题，回顾并更新 `原型图/AnimaCraft_Studio_原型图.md`。

### 2. 用户体验 (UX) 优化

*   [ ] 确保插件的操作流程直观、反馈及时。
*   [ ] 提供清晰的错误提示和引导。
*   [ ] 关注性能，避免插件操作导致被审查页面或浏览器卡顿。

### 3. 跨浏览器/项目测试

*   [ ] 在多个不同结构的 Vue 项目（或纯 JS 项目）中测试插件的兼容性和功能。
*   [ ] (可选) 测试在不同浏览器（如 Edge）上的兼容性。

### 4. 开发模式下的热重载 (HMR)

*   [ ] 研究并解决 Vite HMR 与 Chrome 扩展开发环境的兼容性问题，以提升开发效率。

## IV. 文档与未来规划

### 1. 编写 `README.md`

*   [ ] 项目简介和核心功能。
*   [ ] 插件安装步骤 (开发模式加载、打包后安装)。
*   [ ] 如何在目标 Web 应用中正确暴露 GSAP/XState 实例给插件 (`window.__ANIMACRAFT_STUDIO__` 规范)。
*   [ ] (可选) 插件使用指南、API 参考（如果插件本身也暴露 API）。

### 2. 发布准备 (如果计划发布到 Chrome Web Store)

*   [ ] 准备插件商店所需的宣传材料 (图标、截图、详细描述)。
*   [ ] 遵循 Chrome Web Store 的发布政策和流程。 