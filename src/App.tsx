import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { FormulaForm } from "./components/FormulaForm";
import { ResultCard } from "./components/ResultCard";
import { AdminPanel } from "./components/AdminPanel";
import { AssumptionsDialog } from "./components/AssumptionsDialog";
import { LoginScreen } from "./components/LoginScreen";
import { UserManagement } from "./components/UserManagement";
import { getFormulas, saveFormulas, resetFormulas } from "./constants/formulas";
import { getAssumptions, saveAssumptions, resetAssumptions } from "./constants/defaults";
import { authenticateUser, getCurrentUser, saveCurrentUser, clearCurrentUser } from "./constants/users";
import { calculateFormula } from "./utils/mathEvaluator";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [formulas, setFormulas] = useState([]);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [result, setResult] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const [userManagementOpen, setUserManagementOpen] = useState(false);
  const [assumptions, setAssumptions] = useState({});

  // Load formulas, assumptions, and check for saved user on mount
  useEffect(() => {
    const loadedFormulas = getFormulas();
    const loadedAssumptions = getAssumptions();
    setFormulas(loadedFormulas);
    setAssumptions(loadedAssumptions);
    if (loadedFormulas.length > 0) {
      setSelectedFormula(loadedFormulas[0]);
    }

    // Auto-login if user was previously logged in
    const savedUser = getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
      toast.success(`Welcome back, ${savedUser.userId}!`);
    }
  }, []);

  const handleSelectFormula = (formula) => {
    setSelectedFormula(formula);
    setResult(null);
  };

  const handleCalculate = (inputs) => {
    if (!selectedFormula) return;

    const calculationResult = calculateFormula(selectedFormula.formula, inputs);
    setResult(calculationResult);

    if (calculationResult.success) {
      toast.success("Calculation completed successfully");
    } else {
      toast.error("Calculation failed: " + calculationResult.error);
    }
  };

  const handleSaveFormulas = (updatedFormulas) => {
    setFormulas(updatedFormulas);
    saveFormulas(updatedFormulas);
    
    // Update selected formula if it was edited
    if (selectedFormula) {
      const updated = updatedFormulas.find(f => f.id === selectedFormula.id);
      if (updated) {
        setSelectedFormula(updated);
      } else if (updatedFormulas.length > 0) {
        setSelectedFormula(updatedFormulas[0]);
      } else {
        setSelectedFormula(null);
      }
    }
  };

  const handleResetFormulas = () => {
    const defaultFormulas = resetFormulas();
    setFormulas(defaultFormulas);
    if (defaultFormulas.length > 0) {
      setSelectedFormula(defaultFormulas[0]);
    }
    setResult(null);
    return defaultFormulas;
  };

  const handleSaveAssumptions = (updatedAssumptions) => {
    setAssumptions(updatedAssumptions);
    saveAssumptions(updatedAssumptions);
  };

  const handleResetAssumptions = () => {
    const defaultAssumptions = resetAssumptions();
    setAssumptions(defaultAssumptions);
    return defaultAssumptions;
  };

  const handleExport = (exportData) => {
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `calculation_${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success("Calculation exported successfully");
  };

  const handleLogin = (userId, password) => {
    const user = authenticateUser(userId, password);
    if (user) {
      setCurrentUser(user);
      saveCurrentUser(user); // Save to localStorage for auto-login
      toast.success(`Welcome, ${user.userId}!`);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      setCurrentUser(null);
      clearCurrentUser(); // Clear from localStorage
      setResult(null);
      toast.success("Logged out successfully");
    }
  };

  // Show login screen if not authenticated
  if (!currentUser) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar
        formulas={formulas}
        selectedFormula={selectedFormula}
        onSelectFormula={handleSelectFormula}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenAssumptions={() => setAssumptionsOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenUserManagement={() => setUserManagementOpen(true)}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8 space-y-6">
          <div>
            <h1>Thermodynamic Formula Calculator</h1>
            <p className="text-muted-foreground mt-2">
              Calculate thermodynamic parameters for Solar Energy-Based Binary Vapor Power Cycle (SSBVP)
            </p>
          </div>

          {selectedFormula ? (
            <>
              <FormulaForm
                formula={selectedFormula}
                onCalculate={handleCalculate}
              />

              {result && (
                <ResultCard
                  formula={selectedFormula}
                  inputs={result.inputs || {}}
                  result={result}
                  onExport={handleExport}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No formulas available. Please add formulas in the Admin Panel.
            </div>
          )}
        </div>
      </div>

      <AdminPanel
        open={adminOpen}
        onOpenChange={setAdminOpen}
        formulas={formulas}
        onSave={handleSaveFormulas}
        onReset={handleResetFormulas}
      />

      <AssumptionsDialog
        open={assumptionsOpen}
        onOpenChange={setAssumptionsOpen}
        assumptions={assumptions}
        onSave={handleSaveAssumptions}
        onReset={handleResetAssumptions}
      />

      <UserManagement
        open={userManagementOpen}
        onOpenChange={setUserManagementOpen}
        currentUser={currentUser}
      />

      <Toaster />
    </div>
  );
}
