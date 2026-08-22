const DEFAULT_HISTORY_SIZE = 40;

const getNumericValues = (samples, metric) => samples
  .map((sample) => sample?.[metric])
  .filter(Number.isFinite);

export function createPerformanceHistory(maxSamples = DEFAULT_HISTORY_SIZE) {
  let samples = [];

  const getLimit = () => Math.max(1, Math.floor(maxSamples));

  const getSummary = (metric) => {
    const values = getNumericValues(samples, metric);

    if (!values.length) {
      return {
        average: null,
        min: null,
        max: null,
        latest: null,
        count: 0,
      };
    }

    return {
      average: values.reduce((total, value) => total + value, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      latest: values[values.length - 1],
      count: values.length,
    };
  };

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

    getSummary(metric) {
      return getSummary(metric);
    },

    getAverage(metric) {
      return getSummary(metric).average;
    },

    getMin(metric) {
      return getSummary(metric).min;
    },

    getMax(metric) {
      return getSummary(metric).max;
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
