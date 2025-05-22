<template>
  <div class="panel">
    <header class="panel-header">
      <h1>AnimaCraft Studio</h1>
    </header>
    <main class="panel-content">
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>
      <div class="tab-content">
        <component :is="currentTabComponent" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import XStateViewer from './components/XStateViewer.vue'
import GSAPEditor from './components/GSAPEditor.vue'
import ExportPanel from './components/ExportPanel.vue'

const tabs = [
  { id: 'xstate', name: 'XState Viewer' },
  { id: 'gsap', name: 'GSAP Editor' },
  { id: 'export', name: 'Export' }
]

const currentTab = ref('xstate')

const currentTabComponent = computed(() => {
  switch (currentTab.value) {
    case 'xstate':
      return XStateViewer
    case 'gsap':
      return GSAPEditor
    case 'export':
      return ExportPanel
    default:
      return XStateViewer
  }
})
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  padding: 1rem;
  background-color: var(--primary-color);
  color: white;
}

.panel-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabs {
  display: flex;
  background-color: white;
  border-bottom: 1px solid #ddd;
}

.tabs button {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-color);
}

.tabs button.active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}

.tab-content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}
</style> 