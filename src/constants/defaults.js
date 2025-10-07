const DEFAULT_ASSUMPTIONS = {
  ambientTemp: { value: 298, unit: "K", label: "Ambient Temperature" },
  ambientPressure: { value: 101.325, unit: "kPa", label: "Ambient Pressure" },
  turbineEfficiency: { value: 88, unit: "%", label: "Turbine Isentropic Efficiency" },
  pumpEfficiency: { value: 88, unit: "%", label: "Pump Efficiency" },
  solarRadiation: { value: 800, unit: "W/m²", label: "Solar Radiation" },
  collectorEfficiency: { value: 75, unit: "%", label: "Solar Collector Efficiency" },
  ammoniaConcentration: { value: 40, unit: "%", label: "Ammonia Concentration" },
  heatExchangerEffectiveness: { value: 85, unit: "%", label: "Heat Exchanger Effectiveness" },
};

export function getAssumptions() {
  if (typeof window === 'undefined') return DEFAULT_ASSUMPTIONS;
  
  const stored = localStorage.getItem("assumptions");
  return stored ? JSON.parse(stored) : DEFAULT_ASSUMPTIONS;
}

export function saveAssumptions(updatedAssumptions) {
  if (typeof window !== 'undefined') {
    localStorage.setItem("assumptions", JSON.stringify(updatedAssumptions));
  }
}

export function resetAssumptions() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("assumptions");
  }
  return DEFAULT_ASSUMPTIONS;
}

export const ASSUMPTIONS = DEFAULT_ASSUMPTIONS;
