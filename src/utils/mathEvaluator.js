import { evaluate } from "mathjs";

export function calculateFormula(formula, inputs) {
  try {
    // Convert percentage values to decimals for calculation
    const processedInputs = {};
    Object.keys(inputs).forEach(key => {
      processedInputs[key] = inputs[key];
    });

    const result = evaluate(formula, processedInputs);
    
    return { 
      success: true, 
      result: typeof result === 'number' ? Number(result.toFixed(4)) : result 
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export function substituteFormula(formula, inputs) {
  let substituted = formula;
  
  Object.keys(inputs).forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    substituted = substituted.replace(regex, inputs[key]);
  });
  
  return substituted;
}

export function exportCalculation(formula, inputs, result) {
  return {
    timestamp: new Date().toISOString(),
    formula: formula.title,
    description: formula.description,
    equation: formula.formula,
    inputs: inputs,
    output: result,
  };
}

export function exportTextReport(formula, inputs, result) {
  const timestamp = new Date().toLocaleString();
  const substituted = substituteFormula(formula.formula, inputs);
  
  let report = '';
  report += '═══════════════════════════════════════════════════════════════\n';
  report += '         THERMODYNAMIC CALCULATION REPORT\n';
  report += '         Solar Energy-Based Binary Vapor Power Cycle (SSBVP)\n';
  report += '═══════════════════════════════════════════════════════════════\n\n';
  
  report += `Generated: ${timestamp}\n\n`;
  
  report += '───────────────────────────────────────────────────────────────\n';
  report += 'FORMULA INFORMATION\n';
  report += '───────────────────────────────────────────────────────────────\n\n';
  report += `Formula ID: ${formula.id}\n`;
  report += `Category: ${formula.category}\n`;
  report += `Title: ${formula.title}\n\n`;
  report += `Description:\n${formula.description}\n\n`;
  
  report += '───────────────────────────────────────────────────────────────\n';
  report += 'CALCULATION DETAILS\n';
  report += '───────────────────────────────────────────────────────────────\n\n';
  report += `Formula Expression:\n${formula.formula}\n\n`;
  
  report += 'INPUT VARIABLES:\n';
  report += '─────────────────────────────────────────────\n';
  
  formula.variables.forEach((variable, index) => {
    const value = inputs[variable.key];
    report += `${index + 1}. ${variable.label} (${variable.key})\n`;
    report += `   Value: ${value} ${variable.unit}\n`;
  });
  
  report += '\n';
  report += 'SUBSTITUTED FORMULA:\n';
  report += '─────────────────────────────────────────────\n';
  report += `${substituted}\n\n`;
  
  report += '───────────────────────────────────────────────────────────────\n';
  report += 'CALCULATION RESULT\n';
  report += '───────────────────────────────────────────────────────────────\n\n';
  
  if (result.success) {
    report += `${formula.output.label} (${formula.output.key}):\n`;
    report += `\n`;
    report += `   ╔════════════════════════════════════╗\n`;
    report += `   ║  ${result.result} ${formula.output.unit}`.padEnd(40) + '║\n';
    report += `   ╚════════════════════════════════════╝\n`;
  } else {
    report += `ERROR: ${result.error}\n`;
  }
  
  report += '\n';
  report += '───────────────────────────────────────────────────────────────\n';
  report += 'SUMMARY\n';
  report += '───────────────────────────────────────────────────────────────\n\n';
  report += `Total Input Variables: ${formula.variables.length}\n`;
  report += `Calculation Status: ${result.success ? 'SUCCESS' : 'FAILED'}\n`;
  report += `Output Unit: ${formula.output.unit}\n\n`;
  
  report += '═══════════════════════════════════════════════════════════════\n';
  report += '                    END OF REPORT\n';
  report += '═══════════════════════════════════════════════════════════════\n';
  
  return report;
}
