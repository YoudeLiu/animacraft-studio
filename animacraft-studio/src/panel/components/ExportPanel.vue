<template>
  <div class="export-panel">
    <div class="export-options">
      <h2>Export Options</h2>
      <div class="option-group">
        <label>
          <input type="checkbox" v-model="exportOptions.includeXState">
          Include XState Machine
        </label>
        <label>
          <input type="checkbox" v-model="exportOptions.includeGSAP">
          Include GSAP Animations
        </label>
      </div>
      <div class="format-select">
        <label>Export Format:</label>
        <select v-model="exportOptions.format">
          <option value="js">JavaScript</option>
          <option value="ts">TypeScript</option>
          <option value="vue">Vue Component</option>
        </select>
      </div>
    </div>
    <div class="preview">
      <h2>Preview</h2>
      <pre class="code-preview">{{ previewCode }}</pre>
    </div>
    <div class="actions">
      <button class="export-button" @click="exportCode">
        Export Code
      </button>
      <button class="copy-button" @click="copyToClipboard">
        Copy to Clipboard
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ExportOptions {
  includeXState: boolean
  includeGSAP: boolean
  format: 'js' | 'ts' | 'vue'
}

const exportOptions = ref<ExportOptions>({
  includeXState: true,
  includeGSAP: true,
  format: 'js'
})

const previewCode = computed(() => {
  // 这里将来会添加根据选项生成预览代码的逻辑
  return `// Preview code will be generated here
// based on the selected options`
})

const exportCode = () => {
  // 这里将来会添加导出代码的逻辑
}

const copyToClipboard = () => {
  // 这里将来会添加复制到剪贴板的逻辑
}
</script>

<style scoped>
.export-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.export-options,
.preview {
  background: white;
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
}

.format-select {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.format-select select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.preview {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.code-preview {
  flex: 1;
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow: auto;
  font-family: monospace;
  white-space: pre-wrap;
}

.actions {
  display: flex;
  gap: 1rem;
}

.export-button,
.copy-button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.export-button {
  background-color: var(--primary-color);
  color: white;
}

.copy-button {
  background-color: var(--secondary-color);
  color: white;
}

.export-button:hover,
.copy-button:hover {
  opacity: 0.9;
}
</style> 