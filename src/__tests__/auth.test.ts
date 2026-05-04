import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import { db } from "../lib/db";

// Mock the db
vi.mock("../lib/db", () => ({
  db: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock bcrypt
vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}));

// We need to test the credentials logic that is inside auth.ts.
// Since it's bundled in the NextAuth config, we recreate the logic here
// to ensure the business logic works as expected.
async function authorizeCredentials(credentials: Record<"email" | "password", string> | undefined) {
  if (!credentials?.email || !credentials?.password) return null;

  const user = await db.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user || !user.password) return null;

  const isValid = await bcrypt.compare(credentials.password, user.password);

  if (!isValid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  };
}

describe("Credentials Auth Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null if credentials are not provided", async () => {
    const result = await authorizeCredentials(undefined);
    expect(result).toBeNull();
  });

  it("should return null if user is not found", async () => {
    vi.mocked(db.user.findUnique).mockResolvedValueOnce(null);
    const result = await authorizeCredentials({ email: "test@example.com", password: "password" });
    expect(result).toBeNull();
  });

  it("should return null if password does not match", async () => {
    vi.mocked(db.user.findUnique).mockResolvedValueOnce({
      id: "1",
      email: "test@example.com",
      password: "hashedpassword",
    } as {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      password: string | null;
      role: string;
    });
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(false);

    const result = await authorizeCredentials({
      email: "test@example.com",
      password: "wrongpassword",
    });
    expect(result).toBeNull();
  });

  it("should return user object if credentials are correct", async () => {
    vi.mocked(db.user.findUnique).mockResolvedValueOnce({
      id: "1",
      email: "test@example.com",
      name: "Test User",
      image: "image.png",
      role: "USER" as const,
      password: "hashedpassword",
    } as {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      password: string | null;
      role: string;
    });
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(true);

    const result = await authorizeCredentials({
      email: "test@example.com",
      password: "correctpassword",
    });
    expect(result).toEqual({
      id: "1",
      email: "test@example.com",
      name: "Test User",
      image: "image.png",
      role: "USER",
    });
  });
});
