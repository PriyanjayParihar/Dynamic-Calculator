const DEFAULT_FORMULAS = [
  {
    id: "HS_3.1",
    category: "Heat Source",
    title: "Energy Required at Heat Source",
    description: "Calculates energy supplied to heat the ammonia-water mixture.",
    formula: "m * cp * (Tout - Tin)",
    variables: [
      { key: "m", label: "Mass Flow Rate", unit: "kg/s", default: 10 },
      { key: "cp", label: "Specific Heat", unit: "kJ/kg·K", default: 4.18 },
      { key: "Tin", label: "Inlet Temperature", unit: "°C", default: 20 },
      { key: "Tout", label: "Outlet Temperature", unit: "°C", default: 80 },
    ],
    output: { key: "Q", label: "Heat Energy", unit: "kW" },
  },
  {
    id: "HS_3.2",
    category: "Heat Source",
    title: "Exergy Input at Heat Source",
    description: "Calculates exergy input accounting for ambient temperature.",
    formula: "Q * (1 - (Tamb / Tavg))",
    variables: [
      { key: "Q", label: "Heat Energy", unit: "kW", default: 2508 },
      { key: "Tamb", label: "Ambient Temperature", unit: "K", default: 298 },
      { key: "Tavg", label: "Average Source Temperature", unit: "K", default: 323 },
    ],
    output: { key: "Ex", label: "Exergy Input", unit: "kW" },
  },
  {
    id: "AWT_3.3",
    category: "Turbine",
    title: "Ammonia-Water Turbine Work Output",
    description: "Work output from the ammonia-water turbine.",
    formula: "eta * m * (h1 - h2)",
    variables: [
      { key: "eta", label: "Isentropic Efficiency", unit: "%", default: 88 },
      { key: "m", label: "Mass Flow Rate", unit: "kg/s", default: 10 },
      { key: "h1", label: "Enthalpy (Inlet)", unit: "kJ/kg", default: 1300 },
      { key: "h2", label: "Enthalpy (Exit)", unit: "kJ/kg", default: 900 },
    ],
    output: { key: "W", label: "Work Output", unit: "kW" },
  },
  {
    id: "AWT_3.4",
    category: "Turbine",
    title: "Turbine Exergy Destruction",
    description: "Exergy destroyed due to irreversibilities in the turbine.",
    formula: "m * Tamb * (s2 - s1)",
    variables: [
      { key: "m", label: "Mass Flow Rate", unit: "kg/s", default: 10 },
      { key: "Tamb", label: "Ambient Temperature", unit: "K", default: 298 },
      { key: "s2", label: "Entropy (Exit)", unit: "kJ/kg·K", default: 4.5 },
      { key: "s1", label: "Entropy (Inlet)", unit: "kJ/kg·K", default: 4.2 },
    ],
    output: { key: "Exd", label: "Exergy Destruction", unit: "kW" },
  },
  {
    id: "PUMP_3.5",
    category: "Pump",
    title: "Pump Work Input",
    description: "Work required to pump the working fluid.",
    formula: "(m * v * (P2 - P1)) / eta",
    variables: [
      { key: "m", label: "Mass Flow Rate", unit: "kg/s", default: 10 },
      { key: "v", label: "Specific Volume", unit: "m³/kg", default: 0.001 },
      { key: "P2", label: "Outlet Pressure", unit: "kPa", default: 2000 },
      { key: "P1", label: "Inlet Pressure", unit: "kPa", default: 100 },
      { key: "eta", label: "Pump Efficiency", unit: "%", default: 88 },
    ],
    output: { key: "Wp", label: "Pump Work", unit: "kW" },
  },
  {
    id: "COND_3.6",
    category: "Condenser",
    title: "Condenser Heat Rejection",
    description: "Heat rejected in the condenser.",
    formula: "m * (h_in - h_out)",
    variables: [
      { key: "m", label: "Mass Flow Rate", unit: "kg/s", default: 10 },
      { key: "h_in", label: "Inlet Enthalpy", unit: "kJ/kg", default: 900 },
      { key: "h_out", label: "Outlet Enthalpy", unit: "kJ/kg", default: 300 },
    ],
    output: { key: "Qc", label: "Heat Rejected", unit: "kW" },
  },
  {
    id: "EFF_3.7",
    category: "Efficiency",
    title: "Thermal Efficiency",
    description: "Overall thermal efficiency of the cycle.",
    formula: "(Wnet / Qin) * 100",
    variables: [
      { key: "Wnet", label: "Net Work Output", unit: "kW", default: 3520 },
      { key: "Qin", label: "Heat Input", unit: "kW", default: 2508 },
    ],
    output: { key: "eff", label: "Thermal Efficiency", unit: "%" },
  },
  {
    id: "EFF_3.8",
    category: "Efficiency",
    title: "Exergetic Efficiency",
    description: "Ratio of useful exergy output to exergy input.",
    formula: "(Wnet / Exin) * 100",
    variables: [
      { key: "Wnet", label: "Net Work Output", unit: "kW", default: 3520 },
      { key: "Exin", label: "Exergy Input", unit: "kW", default: 1942 },
    ],
    output: { key: "psi", label: "Exergetic Efficiency", unit: "%" },
  },
  {
    id: "ABSORBER_3.9",
    category: "Absorber",
    title: "Absorber Heat Rejection",
    description: "Heat released during absorption process.",
    formula: "m_rich * h_rich - m_lean * h_lean - m_vapor * h_vapor",
    variables: [
      { key: "m_rich", label: "Rich Solution Flow", unit: "kg/s", default: 12 },
      { key: "h_rich", label: "Rich Solution Enthalpy", unit: "kJ/kg", default: 200 },
      { key: "m_lean", label: "Lean Solution Flow", unit: "kg/s", default: 10 },
      { key: "h_lean", label: "Lean Solution Enthalpy", unit: "kJ/kg", default: 150 },
      { key: "m_vapor", label: "Vapor Flow", unit: "kg/s", default: 2 },
      { key: "h_vapor", label: "Vapor Enthalpy", unit: "kJ/kg", default: 1400 },
    ],
    output: { key: "Qa", label: "Heat Rejected", unit: "kW" },
  },
  {
    id: "SOLAR_3.10",
    category: "Solar",
    title: "Solar Collector Energy",
    description: "Energy collected from solar radiation.",
    formula: "A * I * eta_collector",
    variables: [
      { key: "A", label: "Collector Area", unit: "m²", default: 100 },
      { key: "I", label: "Solar Radiation", unit: "W/m²", default: 800 },
      { key: "eta_collector", label: "Collector Efficiency", unit: "%", default: 75 },
    ],
    output: { key: "Qsolar", label: "Solar Energy", unit: "kW" },
  },
];

export function getFormulas() {
  if (typeof window === 'undefined') return DEFAULT_FORMULAS;
  
  const stored = localStorage.getItem("formulas");
  return stored ? JSON.parse(stored) : DEFAULT_FORMULAS;
}

export function saveFormulas(updatedList) {
  if (typeof window !== 'undefined') {
    localStorage.setItem("formulas", JSON.stringify(updatedList));
  }
}

export function resetFormulas() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("formulas");
  }
  return DEFAULT_FORMULAS;
}

export const FORMULAS = DEFAULT_FORMULAS;
