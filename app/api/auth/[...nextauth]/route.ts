import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import mysql from "mysql2/promise";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import crypto from "crypto";

// Rozszerzamy typy dla next-auth
declare module "next-auth" {
  interface User {
    id?: string;
    role?: string;
  }
  
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
  }
}

// Funkcja porównująca hasło z haszem
async function comparePassword(password: string, hash: string): Promise<boolean> {
  const [salt, hashedValue] = hash.split('$');
  if (!salt || !hashedValue) return false;
  const compareHash = crypto.createHash('sha256');
  compareHash.update(salt + password);
  const compareValue = compareHash.digest('hex');
  return compareValue === hashedValue;
}

// Database connection function
async function executeQuery(query: string, values: any[] = []) {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT)
  });

  try {
    const [results] = await connection.execute(query, values);
    return results;
  } finally {
    await connection.end();
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        try {
          const users = await executeQuery(
            "SELECT * FROM users WHERE email = ?",
            [credentials.email]
          ) as any[];

          if (!users || users.length === 0) {
            console.error("User not found:", credentials.email);
            return null;
          }

          const user = users[0];
          
          if (!user.password || typeof user.password !== 'string') {
            console.error("Invalid password format for user:", credentials.email);
            return null;
          }
          
          const password = credentials.password as string;
          
          const isPasswordValid = await comparePassword(
            password,
            user.password
          );

          if (!isPasswordValid) {
            console.error("Invalid password for user:", credentials.email);
            return null;
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || 'user',
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && profile) {
        try {
          // Sprawdź czy użytkownik istnieje w bazie
          const users = await executeQuery(
            "SELECT id, role FROM users WHERE email = ?",
            [profile.email]
          ) as any[];

          if (users && users.length > 0) {
            token.id = users[0].id;
            token.role = users[0].role || 'user';
          } else {
            // Użytkownik nie istnieje, utwórz go
            const newUserId = crypto.randomUUID();
            await executeQuery(
              "INSERT INTO users (id, email, name, role) VALUES (?, ?, ?, ?)",
              [newUserId, profile.email, profile.name, 'user']
            );
            token.id = newUserId;
            token.role = 'user';
          }
        } catch (error) {
          console.error("Error handling Google user in DB:", error);
        }
      } else if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
