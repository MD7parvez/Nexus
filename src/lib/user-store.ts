export type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  age: number;
  role: "analyst";
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
      age: 25,
      role: "analyst",
      createdAt: new Date().toISOString(),
    });
  }
}
seedDemoUsers();

export function registerUser(input: { name: string; email: string; password: string; age: number }) {
  const name = input.name.trim();
  const normalizedEmail = input.email.trim().toLowerCase();
  if (!name || !normalizedEmail || !input.password.trim()) throw new Error("Name, email and password are required.");
  if (!Number.isInteger(input.age) || input.age < 13 || input.age > 120) throw new Error("Enter a valid age between 13 and 120.");
  if (input.password.length < 10) throw new Error("Password must be at least 10 characters.");
  if (users.has(normalizedEmail)) throw new Error("An account with this email already exists.");
  const user: RegisteredUser = {
    id: `usr-${Date.now()}`, name, email: normalizedEmail,
    password: input.password, age: input.age, role: "analyst",
    createdAt: new Date().toISOString(),
  };
  users.set(normalizedEmail, user);
  return { id: user.id, name: user.name, email: user.email, age: user.age, role: user.role };
}

export function validateUser(email: string, password: string) {
  const user = users.get(email.trim().toLowerCase());
  if (!user || !password || user.password !== password) return null;
  return {
    id: user.id, email: user.email, role: user.role,
    name: user.name, age: user.age,
    organization: "NEXUS Research Workspace",
  };
}
