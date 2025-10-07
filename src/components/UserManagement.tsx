import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Users, Plus, Trash2, Key, Shield, User as UserIcon } from "lucide-react";
import { getUsers, addUser, changeUserPassword, deleteUser } from "../constants/users";
import { toast } from "sonner";

export function UserManagement({ open, onOpenChange, currentUser }) {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (open) {
      loadUsers();
      setShowAddForm(false);
      setShowPasswordForm(false);
    }
  }, [open]);

  const loadUsers = () => {
    const loadedUsers = getUsers();
    setUsers(loadedUsers);
  };

  const handleAddUser = () => {
    if (!formData.userId || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const result = addUser(formData.userId, formData.password, "user");
    
    if (result.success) {
      toast.success("User added successfully");
      loadUsers();
      setShowAddForm(false);
      setFormData({ userId: "", password: "", confirmPassword: "" });
    } else {
      toast.error(result.error);
    }
  };

  const handleChangePassword = () => {
    if (!formData.password) {
      toast.error("Please enter a new password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const result = changeUserPassword(selectedUser.userId, formData.password);
    
    if (result.success) {
      toast.success("Password changed successfully");
      loadUsers();
      setShowPasswordForm(false);
      setSelectedUser(null);
      setFormData({ userId: "", password: "", confirmPassword: "" });
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteUser = (user) => {
    if (user.userId === currentUser.userId) {
      toast.error("Cannot delete your own account");
      return;
    }

    if (user.role === "admin" && users.filter(u => u.role === "admin").length === 1) {
      toast.error("Cannot delete the last admin user");
      return;
    }

    if (confirm(`Are you sure you want to delete user "${user.userId}"?`)) {
      const result = deleteUser(user.userId);
      
      if (result.success) {
        toast.success("User deleted successfully");
        loadUsers();
      } else {
        toast.error(result.error);
      }
    }
  };

  const openChangePassword = (user) => {
    setSelectedUser(user);
    setShowPasswordForm(true);
    setShowAddForm(false);
    setFormData({ userId: "", password: "", confirmPassword: "" });
  };

  const openAddForm = () => {
    setShowAddForm(true);
    setShowPasswordForm(false);
    setSelectedUser(null);
    setFormData({ userId: "", password: "", confirmPassword: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management
          </DialogTitle>
          <DialogDescription>
            Add new users and manage existing user passwords
          </DialogDescription>
        </DialogHeader>

        {!showAddForm && !showPasswordForm ? (
          <div className="space-y-4">
            <Button onClick={openAddForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add New User
            </Button>

            <ScrollArea className="h-[500px] overflow-hidden">
              <div className="space-y-2 pr-4 pb-4">
                {users.map((user) => (
                  <Card key={user.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            user.role === "admin" ? "bg-primary" : "bg-muted"
                          }`}>
                            {user.role === "admin" ? (
                              <Shield className="w-5 h-5 text-primary-foreground" />
                            ) : (
                              <UserIcon className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span>{user.userId}</span>
                              {user.userId === currentUser.userId && (
                                <Badge variant="outline" className="text-xs">You</Badge>
                              )}
                            </div>
                            <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs mt-1">
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openChangePassword(user)}
                          >
                            <Key className="w-4 h-4 mr-2" />
                            Change Password
                          </Button>
                          {user.userId !== currentUser.userId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : showAddForm ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                placeholder="Enter user ID"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm password"
              />
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleAddUser}>
                Add User
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Changing password for:</div>
              <div className="mt-1">{selectedUser?.userId}</div>
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleChangePassword}>
                Change Password
              </Button>
              <Button variant="outline" onClick={() => setShowPasswordForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
