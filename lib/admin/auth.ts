import { cookies } from "next/headers";
import { createHash, randomBytes, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "jhcleans_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "jhcleans-dev-secret-change-me"
  );
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

export async function createAdminSession(): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, hashToken(token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  cookieStore.set(`${SESSION_COOKIE}_token`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(`${SESSION_COOKIE}_token`);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionHash = cookieStore.get(SESSION_COOKIE)?.value;
  const token = cookieStore.get(`${SESSION_COOKIE}_token`)?.value;

  if (!sessionHash || !token) return false;

  const expected = hashToken(token);
  const sessionBuffer = Buffer.from(sessionHash);
  const expectedBuffer = Buffer.from(expected);

  if (sessionBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(sessionBuffer, expectedBuffer);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  const passwordBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expected);

  if (passwordBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(passwordBuffer, expectedBuffer);
}

export { SESSION_COOKIE, getSessionSecret };
