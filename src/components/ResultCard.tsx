import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, AlertCircle, Download, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { substituteFormula, exportCalculation, exportTextReport } from "../utils/mathEvaluator";

export function ResultCard({ formula, inputs, result, onExport }) {
  if (!result) return null;

  const substituted = substituteFormula(formula.formula, inputs);

  const handleExport = () => {
    const exportData = exportCalculation(formula, inputs, result);
    onExport(exportData);
  };

  const handleExportTextReport = () => {
    const reportText = exportTextReport(formula, inputs, result);
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calculation_report_${formula.id}_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={result.success ? "border-green-500" : "border-destructive"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {result.success ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive" />
            )}
            Calculation Result
          </CardTitle>
          {result.success && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportTextReport}>
                <FileText className="w-4 h-4 mr-2" />
                Report
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                JSON
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {result.success ? (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Substituted Formula:</div>
              <div className="p-3 bg-muted rounded-md">
                <code className="text-sm">{substituted}</code>
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">Input Values:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(inputs).map(([key, value]) => {
                  const variable = formula.variables.find(v => v.key === key);
                  return (
                    <Badge key={key} variant="secondary">
                      {key} = {value} {variable?.unit}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
              <div className="text-sm text-muted-foreground mb-1">
                {formula.output.label}
              </div>
              <div className="text-3xl">
                {result.result} <span className="text-xl text-muted-foreground">{formula.output.unit}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-destructive/10 rounded-lg border-2 border-destructive">
            <div className="text-sm text-destructive">
              Error: {result.error}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
