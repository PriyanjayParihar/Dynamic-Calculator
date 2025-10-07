// Default users
const DEFAULT_USERS = [
  {
    id: "user_1",
    userId: "Test",
    password: "Test@12345",
    role: "user",
  },
  {
    id: "admin_1",
    userId: "Psp@gmail.com",
    password: "Psp@gmail.com",
    role: "admin",
  }
];

const USERS_STORAGE_KEY = "thermodynamic_users";

// Get users from localStorage or return defaults
export function getUsers() {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error loading users from localStorage:", e);
  }
  return DEFAULT_USERS;
}

// Save users to localStorage
export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Error saving users to localStorage:", e);
  }
}

// Authenticate user
export function authenticateUser(userId, password) {
  const users = getUsers();
  const user = users.find(u => u.userId === userId && u.password === password);
  return user || null;
}

// Add new user
export function addUser(userId, password, role = "user") {
  const users = getUsers();
  
  // Check if userId already exists
  if (users.find(u => u.userId === userId)) {
    return { success: false, error: "User ID already exists" };
  }
  
  const newUser = {
    id: `user_${Date.now()}`,
    userId,
    password,
    role,
  };
  
  users.push(newUser);
  saveUsers(users);
  return { success: true, user: newUser };
}

// Change user password
export function changeUserPassword(userId, newPassword) {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.userId === userId);
  
  if (userIndex === -1) {
    return { success: false, error: "User not found" };
  }
  
  users[userIndex].password = newPassword;
  saveUsers(users);
  return { success: true };
}

// Delete user
export function deleteUser(userId) {
  const users = getUsers();
  const filteredUsers = users.filter(u => u.userId !== userId);
  
  if (filteredUsers.length === users.length) {
    return { success: false, error: "User not found" };
  }
  
  saveUsers(filteredUsers);
  return { success: true };
}

// Reset to default users
export function resetUsers() {
  saveUsers(DEFAULT_USERS);
  return DEFAULT_USERS;
}

// Current logged-in user storage
const CURRENT_USER_STORAGE_KEY = "thermodynamic_current_user";

// Save current logged-in user
export function saveCurrentUser(user) {
  try {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Error saving current user to localStorage:", e);
  }
}

// Get current logged-in user
export function getCurrentUser() {
  try {
    const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error loading current user from localStorage:", e);
  }
  return null;
}

// Clear current logged-in user
export function clearCurrentUser() {
  try {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  } catch (e) {
    console.error("Error clearing current user from localStorage:", e);
  }
}
