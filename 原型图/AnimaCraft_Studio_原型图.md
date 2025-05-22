 # AnimaCraft Studio - Chrome DevTools 插件原型图描述

## 概述

本原型图描述了 AnimaCraft Studio 插件的主要界面和交互流程，旨在为设计师和开发者提供一个共同的动画调试与优化平台。

## 1. 主 DevTools 面板 (AnimaCraft Studio Tab)

当用户在 Chrome DevTools 中选择 "AnimaCraft Studio" 标签页时，将看到以下主布局。

```
+--------------------------------------------------------------------------+
| AnimaCraft Studio                                                        |
+--------------------------------------------------------------------------+
| [ State Machine (XState) ]  [ Animation Editor (GSAP) ]                  |
|                                                                          |
+--------------------------------------------------------------------------+
|                                                                          |
|                        [   内容区域 (根据选定Tab切换)   ]                 |
|                                                                          |
|                                                                          |
|                                                                          |
|                                                                          |
+--------------------------------------------------------------------------+
```

*   **顶部**: 插件名称 "AnimaCraft Studio"。
*   **Tab导航**: 两个主要标签页：
    *   `State Machine (XState)`: 用于查看 XState 状态机。
    *   `Animation Editor (GSAP)`: 用于编辑和调试 GSAP 动画。
*   **内容区域**: 根据当前选中的 Tab 显示相应的内容。

## 2. State Machine (XState) 视图

选中 `State Machine (XState)` Tab 后的界面。

```
+--------------------------------------------------------------------------+
| AnimaCraft Studio                                                        |
+--------------------------------------------------------------------------+
| [ State Machine (XState) ]  [ Animation Editor (GSAP) ]                  |
+--------------------------------------------------------------------------+
| State Machine Viewer                                                     |
| +----------------------------------------------------------------------+ |
| | Machine: [ Dropdown: select_machine_instance ▼ ]                     | |
| +----------------------------------------------------------------------+ |
| |                                                                      | |
| |  +---------------------+      event_name      +---------------------+  | |
| |  |      State A        |--------------------->|      State B        |  | |
| |  | (current_state_ aktywny) |                     |                     |  | |
| |  +---------------------+                      +---------------------+  | |
| |         ^      |                                        |            | |
| |         |      | event_x                                | event_y    | |
| |         +------+                                        v            | |
| |  +---------------------+                                               | |
| |  |      State C        |                                               | |
| |  +---------------------+                                               | |
| |                                                                      | |
| | (可视化状态图区域，节点可拖动，当前状态高亮)                             | |
| |                                                                      | |
| +----------------------------------------------------------------------+ |
| Optional: Event Log                                                      |
| +----------------------------------------------------------------------+ |
| | [Timestamp] [Event] [From State] [To State]                          | |
| | ...                                                                  | |
| +----------------------------------------------------------------------+ |
+--------------------------------------------------------------------------+
```

*   **标题**: "State Machine Viewer"。
*   **Machine Selector**: 一个下拉菜单 (`select_machine_instance`)，用于在页面注册了多个 XState 实例时进行选择。
*   **可视化状态图区域**: 
    *   以图形方式展示状态 (矩形节点，如 `State A`, `State B`) 和转换 (带事件名称的箭头)。
    *   当前激活的状态会被高亮显示 (例如，通过不同的边框颜色或背景)。
    *   显示状态名称、转换事件名称。
*   **(可选) Event Log**: 一个日志区域，显示最近的状态转换历史，包括时间戳、触发的事件、源状态和目标状态。

## 3. Animation Editor (GSAP) 视图

选中 `Animation Editor (GSAP)` Tab 后的界面。

```
+--------------------------------------------------------------------------+
| AnimaCraft Studio                                                        |
+--------------------------------------------------------------------------+
| [ State Machine (XState) ]  [ Animation Editor (GSAP) ]                  |
+--------------------------------------------------------------------------+
| Animation Editor (GSAP)                                                  |
| +----------------------------------------------------------------------+ |
| | Timeline: [ Dropdown: select_gsap_timeline ▼ ]                       | |
| | Controls: [▶ Play] [❚❚ Pause] [↺ Restart] Speed: [Slider 0.1x-2x]   | |
| | Tools:    [🎯 Pick Element]  [ Export GSAP Code ]                    | |
| +----------------------------------------------------------------------+ |
| |                                                                      | |
| | [ Timeline View (左侧) ]             [ Properties Panel (右侧) ]       | |
| | +-------------------------+          +-----------------------------+ | |
| | | Tween1 [.avatar]        |          | Target: .avatar             | | |
| | | [|||||||duration|||||||] |          | Duration: [ 0.5 ]s          | | |
| | | Tween2 [.username]      |          | Ease: [power1.out ▼]        | | |
| | |      [|||||duration|||]  |          |                             | | |
| | | ...                     |          | Properties:                 | | |
| | | (横向泳道表示不同tween) |          |  +[Add Property]            | | |
| | | (可点选tween)           |          |  - x: [ 100 ]px             | | |
| | |                         |          |  - opacity: [ 1 ]           | | |
| | |                         |          |  - color: [#FFFFF _]        | | |
| | |                         |          |  ...                        | | |
| | |                         |          | Position (Timeline): [ <=>] | | |
| | +-------------------------+          +-----------------------------+ | |
| |                                [ Add New Tween to Timeline ]         | |
| +----------------------------------------------------------------------+ |
+--------------------------------------------------------------------------+
```

### 3.1 顶部工具栏
*   **Timeline Selector**: 下拉菜单 (`select_gsap_timeline`)，列出页面中已注册的GSAP Timeline实例名称。
*   **Global Debug Controls**: 针对当前选中的Timeline:
    *   `Play`, `Pause`, `Restart` 按钮。
    *   `Speed` 控制滑块或输入框，用于调整动画播放速率 (例如 `gsap.globalTimeline.timeScale()`)。
*   **Tools**:
    *   `Pick Element` (🎯图标): 点击后允许用户在被审查页面上选择一个DOM元素，用于创建新动画或作为现有动画的新目标。
    *   `Export GSAP Code` 按钮: 导出当前编辑的Timeline的GSAP代码。 

### 3.2 主要编辑区域 (左右分栏)

#### 3.2.1 左侧: Timeline View
*   可视化展示当前选中的GSAP Timeline。
*   以泳道或堆叠条目的形式展示Timeline中的各个 `tween`。
*   每个 `tween` 条目应显示其目标选择器 (如 `.avatar`) 和大致的持续时间条。
*   允许用户点击选择某个 `tween`，以便在右侧属性面板中编辑其参数。
*   可能有一个播放头指示当前时间。

#### 3.2.2 右侧: Properties Panel (针对选中的 Tween 或创建新 Tween)
*   **Target Element**: 显示当前选中 `tween` 的目标元素 (例如，`.avatar`)。如果通过 `Pick Element` 工具选择，则更新此处。
*   **Duration**: 输入框，用于设置 `tween` 的持续时间 (单位：秒)。
*   **Ease**: 下拉菜单，选择GSAP的缓动函数 (如 `power1.out`, `elastic.inOut`, `none` 等)。
*   **Properties List**: 
    *   一个可动态添加/删除动画属性的列表。
    *   每一行代表一个CSS属性，例如：
        *   `x: [ 100 ] px` (属性名，值输入框，单位)
        *   `opacity: [ 1 ]`
        *   `scale: [ 1.5 ]`
        *   `backgroundColor: [ #ff0000 ]` (带颜色选择器)
    *   `[+ Add Property]` 按钮允许用户添加新的CSS属性进行动画。
*   **Position Parameter (Timeline)**: 输入框，用于设置 `tween`在Timeline中的相对位置 (如 `"<"`, `">+0.2"`, `"-=0.5"`)，这是GSAP Timeline的高级定位参数。
*   **`[ Add New Tween to Timeline ]` 按钮**: 如果没有选中现有tween，或者用户想主动添加，此按钮会基于当前属性面板的设置（或一个新模板）在当前Timeline的末尾（或指定位置）添加一个新的 `tween`。

## 4. 交互流程简述

### 4.1 查看状态机
1.  用户打开AnimaCraft Studio，默认或选择 `State Machine (XState)` Tab。
2.  插件从页面加载XState实例信息并渲染状态图。
3.  用户通过状态图理解动画逻辑，当前状态高亮显示。

### 4.2 编辑GSAP动画
1.  用户切换到 `Animation Editor (GSAP)` Tab。
2.  从Timeline下拉菜单中选择一个要编辑的GSAP Timeline。
3.  左侧Timeline View显示该Timeline的结构。
4.  用户点击Timeline View中的某个 `tween`。
5.  右侧Properties Panel加载并显示该 `tween` 的参数。
6.  用户修改参数 (如duration, ease, x, opacity)。修改应尽可能实时反映在被审查页面的动画上 (Content Script将修改应用到实际GSAP实例)。
7.  用户可以使用顶部的播放控件调试动画。
8.  用户可以使用 `Pick Element` 工具选择页面元素，然后点击 `Add New Tween` 来创建新的动画步骤。
9.  满意后，点击 `Export GSAP Code`，插件生成代码片段供用户下载或复制。

### 4.3 使用Element Picker添加动画
1.  用户点击 `Pick Element` (🎯) 图标。
2.  鼠标在被审查页面上移动时，元素会高亮。
3.  用户点击页面上的一个元素。
4.  焦点回到DevTools插件，Properties Panel可能被预填充该元素作为Target，并提供基础动画属性供用户设置。
5.  用户配置动画后，点击 `Add New Tween to Timeline`。

## 5. 导出代码交互

1.  用户点击 `Export GSAP Code` 按钮。
2.  弹出一个对话框或新视图显示生成的代码片段。
    ```
    +--------------------------------------------------------------------------+
    | Exported GSAP Code for Timeline: 'myCoolAnimation'                       |
    +--------------------------------------------------------------------------+
    | [ Copy to Clipboard ] [ Download as .js ]                                |
    +--------------------------------------------------------------------------+
    | ```javascript                                                            |
    | // Exported from AnimaCraft Studio                                       |
    | // Timeline: myCoolAnimation                                             |
    | // Date: YYYY-MM-DD HH:MM:SS                                             |
    |                                                                          |
    | import { gsap } from 'gsap';                                            |
    |                                                                          |
    | export function playMyCoolAnimation(target) {                            |
    |   const tl = gsap.timeline({ /* original or edited defaults */ });       |
    |   tl.to(target.querySelector('.element1'), {                             |
    |     x: 150,                                                              |
    |     opacity: 0.5,                                                        |
    |     duration: 1.2,                                                       |
    |     ease: 'sine.out'                                                     |
    |   })                                                                     |
    |   .to(target.querySelector('.element2'), {                             |
    |     rotation: 360,                                                       |
    |     scale: 1.2,                                                          |
    |     duration: 0.8                                                        |
    |   }, "-=0.5");                                                            |
    |   // ... other tweens                                                    |
    |   return tl;                                                             |
    | }                                                                        |
    | ```                                                                      |
    +--------------------------------------------------------------------------+
    ```
3.  用户可以选择复制到剪贴板或下载为 `.js` 文件。

