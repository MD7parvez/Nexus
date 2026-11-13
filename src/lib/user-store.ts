export type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
};

const users = new Map<string, RegisteredUser>();

function seedDemoUsers() {
  if (!users.has("analyst@nexus.demo")) {
    users.set("analyst@nexus.demo", {
      id: "demo-user-01",
      name: "Alicia Chen",
      email: "analyst@nexus.demo",
      password: "demo123",
      role: "analyst",
      createdAt: new Date().toISOString(),
    });
  }
}

seedDemoUsers();

export function registerUser(input: { name: string; email: string; password: string; role?: string }) {
  const normalizedEmail = input.email.trim().toLowerCase();

  if (!normalizedEmail || !input.password.trim()) {
    throw new Error("Email and password are required.");
  }

  if (users.has(normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const user: RegisteredUser = {
    id: `usr-${Date.now()}`,
    name: input.name.trim() || "NEXUS Analyst",
    email: normalizedEmail,
    password: input.password,
    role: input.role ?? "analyst",
    createdAt: new Date().toISOString(),
  };

  users.set(normalizedEmail, user);
  return user;
}

export function validateUser(email: string, password: string) {
  const user = users.get(email.trim().toLowerCase());

  if (!user || user.password !== password) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    organization: "Civic Integrity Office",
  };
}

export function getUsersSnapshot() {
  return Array.from(users.values());
}
