import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";

export function AssumptionsDialog({ open, onOpenChange, assumptions, onSave, onReset }) {
  const [editedAssumptions, setEditedAssumptions] = useState(assumptions);

  useEffect(() => {
    setEditedAssumptions(assumptions);
  }, [assumptions]);

  const handleSave = () => {
    onSave(editedAssumptions);
    toast.success("Assumptions saved successfully");
    onOpenChange(false);
  };

  const handleReset = () => {
    if (confirm("Reset all assumptions to default values?")) {
      const reset = onReset();
      setEditedAssumptions(reset);
      toast.success("Assumptions reset to defaults");
    }
  };

  const updateValue = (key, newValue) => {
    setEditedAssumptions({
      ...editedAssumptions,
      [key]: {
        ...editedAssumptions[key],
        value: parseFloat(newValue) || 0
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>System Assumptions</DialogTitle>
          <DialogDescription>
            Configure default values for common parameters used across calculations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 pb-4">
          {Object.entries(editedAssumptions).map(([key, data]) => (
            <Card key={key} className="hover:bg-muted/50 transition-colors">
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div className="col-span-2 space-y-1">
                    <Label>{data.label}</Label>
                    <div className="text-xs text-muted-foreground">{key}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Value ({data.unit})</Label>
                    <Input
                      type="number"
                      step="any"
                      value={data.value}
                      onChange={(e) => updateValue(key, e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
