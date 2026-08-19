const readJsHeap = () => {
  if (typeof performance === 'undefined' || !performance.memory) {
    return null;
  }

  return {
    usedMB: performance.memory.usedJSHeapSize / 1024 / 1024,
    totalMB: performance.memory.totalJSHeapSize / 1024 / 1024,
  };
};

export const PERFORMANCE_METRICS = [
  {
    id: 'fps',
    label: 'FPS',
    category: 'rendering',
    unit: 'fps',
    collect: ({ elapsed, frames }) => frames / elapsed,
  },
  {
    id: 'frameTime',
    label: 'Frame time',
    category: 'rendering',
    unit: 'ms',
    collect: ({ elapsed, frames }) => (elapsed / frames) * 1000,
  },
  {
    id: 'geometries',
    label: 'Geometries',
    category: 'three',
    unit: 'count',
    collect: ({ renderer }) => renderer.info.memory.geometries,
  },
  {
    id: 'textures',
    label: 'Textures',
    category: 'three',
    unit: 'count',
    collect: ({ renderer }) => renderer.info.memory.textures,
  },
  {
    id: 'calls',
    label: 'Draw calls',
    category: 'three',
    unit: 'count',
    collect: ({ renderer }) => renderer.info.render.calls,
  },
  {
    id: 'triangles',
    label: 'Triangles',
    category: 'three',
    unit: 'count',
    collect: ({ renderer }) => renderer.info.render.triangles,
  },
  {
    id: 'points',
    label: 'Points',
    category: 'three',
    unit: 'count',
    collect: ({ renderer }) => renderer.info.render.points,
  },
  {
    id: 'lines',
    label: 'Lines',
    category: 'three',
    unit: 'count',
    collect: ({ renderer }) => renderer.info.render.lines,
  },
  {
    id: 'jsHeap',
    label: 'JS heap',
    category: 'browser',
    unit: 'memory',
    collect: () => readJsHeap(),
  },
];

export const collectMetrics = (definitions, context) => {
  return definitions.reduce((metrics, definition) => {
    metrics[definition.id] = definition.collect(context);
    return metrics;
  }, {});
};

export { readJsHeap };
