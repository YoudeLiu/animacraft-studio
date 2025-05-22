import { defineStore } from 'pinia';

export interface TimelineSnapshot {
  id: string;
  progress: number;
  duration: number;
  // Możesz dodać inne istotne właściwości, takie jak vars, isActive, jeśli będą potrzebne później
  // 你可以稍后根据需要添加其他相关属性，例如 vars, isActive
}

export interface GSAPDebugState {
  timelines: Record<string, TimelineSnapshot>; // 以ID为键的时间线
}

export const useGSAPDebugDataStore = defineStore('gsapDebugData', {
  state: (): GSAPDebugState => ({
    timelines: {},
  }),
  actions: {
    /**
     * 设置所有时间线数据，用于完全刷新或初始加载。
     * @param newTimelines 时间线快照数组
     */
    setAllTimelines(newTimelines: TimelineSnapshot[]) {
      const timelinesMap: Record<string, TimelineSnapshot> = {};
      newTimelines.forEach(timeline => {
        // 确保 timeline.id 存在且是有效的字符串键
        const id = timeline.id && typeof timeline.id === 'string' ? timeline.id : `generated_${Math.random().toString(36).substr(2, 9)}`;
        timelinesMap[id] = timeline;
      });
      this.timelines = timelinesMap;
      // console.log('[Pinia Store] All timelines set:', JSON.parse(JSON.stringify(this.timelines)));
    },

    /**
     * 更新或添加单个时间线的快照。
     * 如果需要更细致的增量更新（例如，仅更新特定属性），可以扩展此方法或添加新方法。
     * @param timelineSnapshot 单个时间线的快照
     */
    updateTimeline(timelineSnapshot: TimelineSnapshot) {
      // 确保 timelineSnapshot.id 存在且是有效的字符串键
      const id = timelineSnapshot.id && typeof timelineSnapshot.id === 'string' ? timelineSnapshot.id : `generated_${Math.random().toString(36).substr(2, 9)}`;
      this.timelines[id] = { ...timelineSnapshot };
      // 为了确保响应性，如果直接修改嵌套对象，有时需要重新分配顶层对象
      // this.timelines = { ...this.timelines }; 
      // console.log('[Pinia Store] Timeline updated/added:', id, JSON.parse(JSON.stringify(this.timelines[id])));
    },

    /**
     * 根据ID移除一个时间线。
     * @param timelineId 要移除的时间线的ID
     */
    removeTimeline(timelineId: string) {
      if (this.timelines[timelineId]) {
        delete this.timelines[timelineId];
        // 确保响应性
        this.timelines = { ...this.timelines };
        // console.log('[Pinia Store] Timeline removed:', timelineId);
      }
    },

    /**
     * 清空所有时间线数据。
     */
    clearAllTimelines() {
      this.timelines = {};
      // console.log('[Pinia Store] All timelines cleared');
    }
  },
  getters: {
    /**
     * 获取所有时间线快照的数组。
     */
    getTimelineArray: (state): TimelineSnapshot[] => Object.values(state.timelines),
    /**
     * 根据ID获取单个时间线快照。
     */
    getTimelineById: (state) => (id: string): TimelineSnapshot | undefined => state.timelines[id],
  }
});

// 定义将通过自定义事件发送的数据结构
export interface GSAPEventPayload {
  type: 'GSAP_FULL_STATE_UPDATE' | 'GSAP_INCREMENTAL_UPDATE';
  payload: {
    timelines: Record<string, TimelineSnapshot>;
  };
} 