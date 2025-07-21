import { redirect } from "next/navigation";
import crypto from "crypto";
import mysql from "mysql2/promise";

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

export type Session = {
  user: User;
};

// Database connection function
export async function executeQuery(query: string, values: any[] = [], retryCount = 0) {
  try {
    console.log(`Attempting database connection (try ${retryCount + 1})`);
    console.log(`Query: ${query.substring(0, 100)}...`);
    console.log(`Values: ${JSON.stringify(values)}`);

    const config = {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: Number(process.env.DATABASE_PORT),
      multipleStatements: true,
      charset: 'utf8mb4',
      connectTimeout: 60000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    };
    
    console.log(`Database config: ${JSON.stringify({ 
      host: config.host, 
      user: config.user, 
      database: config.database, 
      port: config.port 
    })}`);

    const connection = await mysql.createConnection(config);
    console.log("Database connection established successfully");

    try {
      console.log("Executing query...");
      const [results] = await connection.execute(query, values);
      console.log(`Query executed successfully with ${Array.isArray(results) ? results.length : 0} results`);
      return results;
    } catch (error: any) {
      console.error("Query execution error:", error.message);
      console.error(`Error code: ${error.code}, sqlState: ${error.sqlState}, sqlMessage: ${error.sqlMessage}`);
      throw error;
    } finally {
      try {
        await connection.end();
        console.log("Database connection closed successfully");
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  } catch (error: any) {
    console.error("Database connection error:", error.message);
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
    
    if (retryCount < 3) {
      console.log(`Retrying database connection (${retryCount + 1}/3)...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return executeQuery(query, values, retryCount + 1);
    }
    throw new Error(`Failed to connect to database after ${retryCount} attempts: ${error.message}`);
  }
}

// Funkcja hashowania hasła - zastępuje bcrypt
export async function hashPassword(password: string): Promise<string> {
  // Generowanie soli - prosta implementacja
  const salt = crypto.randomBytes(16).toString('hex');
  
  // Zastosowanie funkcji skrótu SHA-256
  const hash = crypto.createHash('sha256');
  hash.update(salt + password);
  const hashedValue = salt + '$' + hash.digest('hex');
  
  return hashedValue;
}

// Funkcja porównująca hasło z haszem - zastępuje bcrypt.compare
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  // Podział hashu na sól i wartość skrótu
  const [salt, hashedValue] = hash.split('$');
  
  // Jeśli nie ma oczekiwanego formatu, zwróć false
  if (!salt || !hashedValue) return false;
  
  // Haszowanie podanego hasła z tą samą solą
  const compareHash = crypto.createHash('sha256');
  compareHash.update(salt + password);
  const compareValue = compareHash.digest('hex');
  
  // Porównanie wyliczonego skrótu z zapisanym
  return compareValue === hashedValue;
}

// Register a new user
export async function registerUser(name: string, email: string, password: string) {
  try {
    // Check if user already exists
    const existingUsers = await executeQuery(
      "SELECT * FROM users WHERE email = ?",
      [email]
    ) as any[];

    if (existingUsers && existingUsers.length > 0) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user - sprawdź czy tabela istnieje, jeśli nie, utwórz ją
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        reset_token VARCHAR(255) DEFAULT NULL,
        reset_token_expires DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `, []);

    // Generuj unikalny identyfikator
    const userId = crypto.randomUUID();

    // Dodaj użytkownika
    await executeQuery(
      "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
      [userId, name, email, hashedPassword]
    );

    return { success: true };
  } catch (error: any) {
    console.error("Registration error:", error);
    throw new Error(error.message || "An error occurred during registration");
  }
}
