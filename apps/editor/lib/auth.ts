import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

// In-memory user store (replace with database in production)
const users: User[] = [
  {
    id: '1',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
];

const userPasswords: Record<string, string> = {
  '1': process.env.ADMIN_PASSWORD || 'admin123',
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = users.find(u => u.id === decoded.id);
    return user || null;
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = users.find(u => u.email === email);
  if (!user) {
    return null;
  }

  // For demo purposes, we're comparing plain passwords
  // In production, store hashed passwords and use verifyPassword
  const storedPassword = userPasswords[user.id];
  if (password !== storedPassword) {
    return null;
  }

  return user;
}

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

