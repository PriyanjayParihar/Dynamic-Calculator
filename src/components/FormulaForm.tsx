import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Calculator } from "lucide-react";

export function FormulaForm({ formula, onCalculate }) {
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    // Initialize inputs with default values
    const defaultInputs = {};
    formula.variables.forEach((variable) => {
      defaultInputs[variable.key] = variable.default;
    });
    setInputs(defaultInputs);
  }, [formula]);

  const handleInputChange = (key, value) => {
    setInputs((prev) => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }));
  };

  const handleCalculate = () => {
    onCalculate(inputs);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCalculate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formula.title}</CardTitle>
        <CardDescription>{formula.description}</CardDescription>
        <div className="mt-2 p-3 bg-muted rounded-md">
          <div className="text-sm text-muted-foreground mb-1">Formula:</div>
          <code className="text-sm">{formula.formula}</code>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {formula.variables.map((variable) => (
            <div key={variable.key} className="space-y-2">
              <Label htmlFor={variable.key}>
                {variable.label}
                {variable.unit && <span className="text-muted-foreground ml-1">({variable.unit})</span>}
              </Label>
              <Input
                id={variable.key}
                type="number"
                step="any"
                value={inputs[variable.key] || ""}
                onChange={(e) => handleInputChange(variable.key, e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Enter ${variable.label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        <Button onClick={handleCalculate} className="w-full">
          <Calculator className="w-4 h-4 mr-2" />
          Calculate
        </Button>
      </CardContent>
    </Card>
  );
}
