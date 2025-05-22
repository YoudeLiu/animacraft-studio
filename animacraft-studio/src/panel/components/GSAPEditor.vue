<template>
  <div class="gsap-editor">
    <div class="timeline-list">
      <h2>Timelines</h2>
      <div class="timeline-items">
        <div 
          v-for="timeline in timelines" 
          :key="timeline.id"
          :class="['timeline-item', { active: selectedTimeline === timeline.id }]"
          @click="selectTimeline(timeline.id)"
        >
          {{ timeline.name }}
        </div>
      </div>
    </div>
    <div class="timeline-editor" v-if="selectedTimeline">
      <div class="timeline-controls">
        <button @click="playTimeline">Play</button>
        <button @click="pauseTimeline">Pause</button>
        <button @click="stopTimeline">Stop</button>
        <input 
          type="range" 
          v-model="timelineProgress" 
          min="0" 
          max="100" 
          step="0.1"
          @input="seekTimeline"
        >
      </div>
      <div class="tween-list">
        <h3>Tweens</h3>
        <div 
          v-for="tween in tweens" 
          :key="tween.id"
          class="tween-item"
        >
          <div class="tween-header">
            <span>{{ tween.target }}</span>
            <span>{{ tween.duration }}s</span>
          </div>
          <div class="tween-properties">
            <div 
              v-for="(value, prop) in tween.properties" 
              :key="prop"
              class="property"
            >
              <span class="property-name">{{ prop }}:</span>
              <span class="property-value">{{ value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="no-timeline" v-else>
      Select a timeline to edit
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Timeline {
  id: string
  name: string
}

interface Tween {
  id: string
  target: string
  duration: number
  properties: Record<string, any>
}

const timelines = ref<Timeline[]>([])
const selectedTimeline = ref<string | null>(null)
const timelineProgress = ref(0)
const tweens = ref<Tween[]>([])

const selectTimeline = (id: string) => {
  selectedTimeline.value = id
  // 这里将来会添加获取选中时间轴的所有补间动画的逻辑
}

const playTimeline = () => {
  // 这里将来会添加播放时间轴的逻辑
}

const pauseTimeline = () => {
  // 这里将来会添加暂停时间轴的逻辑
}

const stopTimeline = () => {
  // 这里将来会添加停止时间轴的逻辑
}

const seekTimeline = () => {
  // 这里将来会添加跳转到指定时间点的逻辑
}
</script>

<style scoped>
.gsap-editor {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 1rem;
  height: 100%;
}

.timeline-list,
.timeline-editor {
  background: white;
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.timeline-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.timeline-item {
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.timeline-item:hover {
  background-color: #f5f5f5;
}

.timeline-item.active {
  background-color: var(--primary-color);
  color: white;
}

.timeline-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.timeline-controls button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: var(--primary-color);
  color: white;
  cursor: pointer;
}

.timeline-controls button:hover {
  opacity: 0.9;
}

.timeline-controls input[type="range"] {
  flex: 1;
}

.tween-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tween-item {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 1rem;
}

.tween-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.tween-properties {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
}

.property {
  display: flex;
  gap: 0.5rem;
}

.property-name {
  color: #666;
}

.no-timeline {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-style: italic;
}
</style> 