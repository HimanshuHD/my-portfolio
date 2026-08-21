const DEFAULT_HISTORY_SIZE = 40;

const getNumericValues = (samples, metric) => samples
  .map((sample) => sample?.[metric])
  .filter(Number.isFinite);

export function createPerformanceHistory(maxSamples = DEFAULT_HISTORY_SIZE) {
  let samples = [];

  const getLimit = () => Math.max(1, Math.floor(maxSamples));

  return {
    add(sample) {
      if (!sample || typeof sample !== 'object') {
        return samples;
      }

      samples = [
        ...samples,
        sample,
      ].slice(-getLimit());

      return samples;
    },

    getSamples() {
      return samples;
    },

    getLatest() {
      return samples.length ? samples[samples.length - 1] : null;
    },

    getValues(metric) {
      return getNumericValues(samples, metric);
    },

    getAverage(metric) {
      const values = getNumericValues(samples, metric);

      if (!values.length) {
        return null;
      }

      return values.reduce((total, value) => total + value, 0) / values.length;
    },

    getMin(metric) {
      const values = getNumericValues(samples, metric);
      return values.length ? Math.min(...values) : null;
    },

    getMax(metric) {
      const values = getNumericValues(samples, metric);
      return values.length ? Math.max(...values) : null;
    },

    clear() {
      samples = [];
    },

    size() {
      return samples.length;
    },
  };
}

export { DEFAULT_HISTORY_SIZE };
