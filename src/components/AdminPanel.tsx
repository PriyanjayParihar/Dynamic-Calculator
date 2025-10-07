import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trash2, Plus, Edit2, Download, Upload, RotateCcw } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

const CATEGORIES = ["Heat Source", "Turbine", "Pump", "Condenser", "Efficiency", "Absorber", "Solar"];

export function AdminPanel({ open, onOpenChange, formulas, onSave, onReset }) {
  const [editingFormula, setEditingFormula] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddNew = () => {
    setEditingFormula({
      id: `CUSTOM_${Date.now()}`,
      category: "Heat Source",
      title: "",
      description: "",
      formula: "",
      variables: [],
      output: { key: "result", label: "Result", unit: "" },
    });
    setShowForm(true);
  };

  const handleEdit = (formula) => {
    setEditingFormula({ ...formula });
    setShowForm(true);
  };

  const handleDelete = (formulaId) => {
    if (confirm("Are you sure you want to delete this formula?")) {
      const updated = formulas.filter(f => f.id !== formulaId);
      onSave(updated);
      toast.success("Formula deleted successfully");
    }
  };

  const handleSaveFormula = () => {
    if (!editingFormula.title || !editingFormula.formula) {
      toast.error("Title and formula are required");
      return;
    }

    const exists = formulas.find(f => f.id === editingFormula.id);
    let updated;
    
    if (exists) {
      updated = formulas.map(f => f.id === editingFormula.id ? editingFormula : f);
      toast.success("Formula updated successfully");
    } else {
      updated = [...formulas, editingFormula];
      toast.success("Formula added successfully");
    }

    onSave(updated);
    setShowForm(false);
    setEditingFormula(null);
  };

  const handleExportAll = () => {
    const dataStr = JSON.stringify(formulas, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `formulas_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success("Formulas exported successfully");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          onSave(imported);
          toast.success("Formulas imported successfully");
        } catch (error) {
          toast.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all formulas to defaults? This cannot be undone.")) {
      onReset();
      toast.success("Formulas reset to defaults");
    }
  };

  const addVariable = () => {
    setEditingFormula({
      ...editingFormula,
      variables: [
        ...editingFormula.variables,
        { key: "", label: "", unit: "", default: 0 }
      ]
    });
  };

  const updateVariable = (index, field, value) => {
    const updated = [...editingFormula.variables];
    updated[index] = { ...updated[index], [field]: value };
    setEditingFormula({ ...editingFormula, variables: updated });
  };

  const removeVariable = (index) => {
    const updated = editingFormula.variables.filter((_, i) => i !== index);
    setEditingFormula({ ...editingFormula, variables: updated });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Admin Panel</DialogTitle>
          <DialogDescription>
            Manage formulas with automatic localStorage persistence
          </DialogDescription>
        </DialogHeader>

        {!showForm ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
              <Button variant="outline" onClick={handleExportAll}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={() => document.getElementById('import-file').click()}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <input
                id="import-file"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
              <Button variant="outline" onClick={handleReset} className="ml-auto">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <ScrollArea className="h-[500px] overflow-hidden">
              <div className="space-y-2 pr-4 pb-4">
                {formulas.map((formula) => (
                  <Card key={formula.id} className="hover:bg-muted/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">{formula.id}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <Badge variant="secondary" className="text-xs">
                              {formula.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-base">{formula.title}</CardTitle>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(formula)} className="h-8 w-8 p-0">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(formula.id)} className="h-8 w-8 p-0">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <code className="text-xs bg-muted px-2 py-1 rounded block font-mono">{formula.formula}</code>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <ScrollArea className="h-[500px] overflow-hidden">
            <div className="space-y-6 pr-4 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Formula ID</Label>
                    <Input
                      value={editingFormula.id}
                      onChange={(e) => setEditingFormula({ ...editingFormula, id: e.target.value })}
                      placeholder="e.g., HS_3.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={editingFormula.category}
                      onValueChange={(value) => setEditingFormula({ ...editingFormula, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={editingFormula.title}
                    onChange={(e) => setEditingFormula({ ...editingFormula, title: e.target.value })}
                    placeholder="Formula title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editingFormula.description}
                    onChange={(e) => setEditingFormula({ ...editingFormula, description: e.target.value })}
                    placeholder="Describe what this formula calculates"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Formula Expression</Label>
                  <Input
                    value={editingFormula.formula}
                    onChange={(e) => setEditingFormula({ ...editingFormula, formula: e.target.value })}
                    placeholder="e.g., m * cp * (Tout - Tin)"
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Variables</Label>
                  <Button size="sm" variant="outline" onClick={addVariable}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variable
                  </Button>
                </div>

                {editingFormula.variables.map((variable, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-5 gap-3 items-end">
                        <div className="space-y-2">
                          <Label className="text-xs">Key</Label>
                          <Input
                            value={variable.key}
                            onChange={(e) => updateVariable(index, 'key', e.target.value)}
                            placeholder="e.g., m"
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label className="text-xs">Label</Label>
                          <Input
                            value={variable.label}
                            onChange={(e) => updateVariable(index, 'label', e.target.value)}
                            placeholder="e.g., Mass Flow"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Unit</Label>
                          <Input
                            value={variable.unit}
                            onChange={(e) => updateVariable(index, 'unit', e.target.value)}
                            placeholder="e.g., kg/s"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Default</Label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              value={variable.default}
                              onChange={(e) => updateVariable(index, 'default', parseFloat(e.target.value))}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVariable(index)}
                              className="flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Output</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Key</Label>
                    <Input
                      value={editingFormula.output.key}
                      onChange={(e) => setEditingFormula({
                        ...editingFormula,
                        output: { ...editingFormula.output, key: e.target.value }
                      })}
                      placeholder="e.g., Q"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={editingFormula.output.label}
                      onChange={(e) => setEditingFormula({
                        ...editingFormula,
                        output: { ...editingFormula.output, label: e.target.value }
                      })}
                      placeholder="e.g., Heat Energy"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Unit</Label>
                    <Input
                      value={editingFormula.output.unit}
                      onChange={(e) => setEditingFormula({
                        ...editingFormula,
                        output: { ...editingFormula.output, unit: e.target.value }
                      })}
                      placeholder="e.g., kW"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleSaveFormula}>
                  Save Formula
                </Button>
                <Button variant="outline" onClick={() => {
                  setShowForm(false);
                  setEditingFormula(null);
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
