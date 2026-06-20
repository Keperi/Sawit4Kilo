// Statistical helper functions for analytics

export const calculateMean = (arr) => {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

export const calculateStdDev = (arr) => {
  if (!arr.length) return 0;
  const mean = calculateMean(arr);
  const squareDiffs = arr.map((v) => Math.pow(v - mean, 2));
  return Math.sqrt(calculateMean(squareDiffs));
};

export const calculateMin = (arr) => Math.min(...arr);
export const calculateMax = (arr) => Math.max(...arr);

export const calculatePearsonCorrelation = (x, y) => {
  if (x.length !== y.length || x.length === 0) return 0;
  const n = x.length;
  const meanX = calculateMean(x);
  const meanY = calculateMean(y);
  let numerator = 0;
  let denomX = 0;
  let denomY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  const denom = Math.sqrt(denomX * denomY);
  return denom === 0 ? 0 : numerator / denom;
};

export const detectAnomalies = (data, phThresholdMin = 4.5, phThresholdMax = 9.0, tdsThreshold = 800) => {
  const anomalies = [];
  const phValues = data.map((d) => d.ph);
  const tdsValues = data.map((d) => d.tds);
  const phMean = calculateMean(phValues);
  const phStd = calculateStdDev(phValues);
  const tdsMean = calculateMean(tdsValues);
  const tdsStd = calculateStdDev(tdsValues);

  data.forEach((point, i) => {
    const phDev = Math.abs(point.ph - phMean);
    const tdsDev = Math.abs(point.tds - tdsMean);
    const phAnomaly = phDev > 2 * phStd || point.ph < phThresholdMin || point.ph > phThresholdMax;
    const tdsAnomaly = tdsDev > 2 * tdsStd || point.tds > tdsThreshold;

    if (phAnomaly || tdsAnomaly) {
      const severity = (phDev > 3 * phStd || tdsDev > 3 * tdsStd) ? 'Berat' :
                       (phDev > 2 * phStd || tdsDev > 2 * tdsStd) ? 'Sedang' : 'Ringan';
      anomalies.push({
        time: point.time,
        ph: point.ph,
        tds: point.tds,
        type: phAnomaly && tdsAnomaly ? 'pH & TDS' : phAnomaly ? 'pH' : 'TDS',
        severity,
      });
    }
  });

  return anomalies;
};

export const linearRegression = (data) => {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: 0, predict: () => 0 };
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  data.forEach((d, i) => {
    sumX += i;
    sumY += d;
    sumXY += i * d;
    sumX2 += i * i;
  });
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return {
    slope,
    intercept,
    predict: (x) => intercept + slope * x,
  };
};

export const generateStatsSummary = (data, phMin, phMax, tdsMax) => {
  const phValues = data.map((d) => d.ph);
  const tdsValues = data.map((d) => d.tds);

  return {
    ph: {
      mean: calculateMean(phValues),
      min: calculateMin(phValues),
      max: calculateMax(phValues),
      stdDev: calculateStdDev(phValues),
      correlation: calculatePearsonCorrelation(phValues, tdsValues),
    },
    tds: {
      mean: calculateMean(tdsValues),
      min: calculateMin(tdsValues),
      max: calculateMax(tdsValues),
      stdDev: calculateStdDev(tdsValues),
    },
    dangerCount: data.filter((d) => d.ph < phMin || d.ph > phMax || d.tds > tdsMax).length,
    totalPoints: data.length,
  };
};
