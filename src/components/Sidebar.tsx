import { Settings, Calculator, Flame, Fan, Droplets, TrendingUp, Sun, Box, LogOut, Users } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

const categoryIcons = {
  "Heat Source": Flame,
  "Turbine": Fan,
  "Pump": Droplets,
  "Condenser": Box,
  "Efficiency": TrendingUp,
  "Absorber": Box,
  "Solar": Sun,
};

export function Sidebar({ formulas, selectedFormula, onSelectFormula, onOpenAdmin, onOpenAssumptions, currentUser, onLogout, onOpenUserManagement }) {
  // Group formulas by category
  const categorizedFormulas = formulas.reduce((acc, formula) => {
    if (!acc[formula.category]) {
      acc[formula.category] = [];
    }
    acc[formula.category].push(formula);
    return acc;
  }, {});

  return (
    <div className="w-80 border-r bg-card flex flex-col h-full">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          <h2>Thermodynamic Calculator</h2>
        </div>
        
        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
          <div className="flex-1 min-w-0">
            <div className="text-sm truncate">{currentUser?.userId}</div>
            <Badge variant={currentUser?.role === "admin" ? "default" : "secondary"} className="text-xs mt-1">
              {currentUser?.role}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onLogout}
            className="flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenAdmin}
            className="flex-1"
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenAssumptions}
            className="flex-1"
          >
            Assumptions
          </Button>
        </div>
        
        {currentUser?.role === "admin" && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenUserManagement}
            className="w-full"
          >
            <Users className="w-4 h-4 mr-2" />
            User Management
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-4 pb-6 space-y-4">
          {Object.entries(categorizedFormulas).map(([category, formulas]) => {
            const Icon = categoryIcons[category] || Calculator;
            
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{category}</span>
                </div>
                <div className="space-y-1 ml-6">
                  {formulas.map((formula) => (
                    <button
                      key={formula.id}
                      onClick={() => onSelectFormula(formula)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedFormula?.id === formula.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                    >
                      <div>{formula.title}</div>
                      <div className="text-xs opacity-70 mt-0.5">
                        {formula.id}
                      </div>
                    </button>
                  ))}
                </div>
                <Separator className="mt-4" />
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-3">
        {currentUser && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div className="text-foreground">{currentUser.userId}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={currentUser.role === "admin" ? "default" : "secondary"} className="text-xs">
                    {currentUser.role}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="h-8 w-8 p-0"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
            {currentUser.role === "admin" && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenUserManagement}
                className="w-full"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            )}
          </div>
        )}
        <Separator />
        <div className="text-xs text-muted-foreground">
          <div>Total Formulas: {formulas.length}</div>
          <div className="mt-1">Solar Energy-Based Binary Vapor Power Cycle (SSBVP)</div>
        </div>
      </div>
    </div>
  );
}
