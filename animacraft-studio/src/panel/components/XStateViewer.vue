<template>
  <div class="xstate-viewer">
    <div class="state-machine">
      <h2>State Machine</h2>
      <div class="state-graph">
        <!-- 这里将来会使用图形库来渲染状态机图 -->
        <div class="placeholder">State Machine Visualization Coming Soon</div>
      </div>
    </div>
    <div class="state-info">
      <h2>Current State</h2>
      <div class="current-state">
        {{ currentState || 'No state machine detected' }}
      </div>
      <h2>Context</h2>
      <pre class="context">{{ context || '{}' }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentState = ref('')
const context = ref('')

onMounted(() => {
  // 这里将来会添加与 content script 的通信逻辑
  // 以获取状态机的当前状态和上下文
})
</script>

<style scoped>
.xstate-viewer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 100%;
}

.state-machine,
.state-info {
  background: white;
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.state-graph {
  height: 300px;
  border: 1px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  color: #999;
}

.current-state {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin: 0.5rem 0;
}

.context {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow: auto;
  max-height: 200px;
}
</style> 