// src/lib/env.ts
export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value; // ✅ TS now sees this as string
}
