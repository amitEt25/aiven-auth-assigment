import pool from '../database/connection';
import { CryptoUtils } from '../utils/crypto';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface UserResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async create(userData: CreateUserData): Promise<UserResponse> {
    const { email, password, first_name, last_name } = userData;
    
    const password_hash = CryptoUtils.hashPassword(password);
    
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, last_name, created_at, updated_at
    `;
    
    const values = [email, password_hash, first_name, last_name];
    const result = await pool.query(query, values);
    
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<UserResponse | null> {
    const query = `
      SELECT id, email, first_name, last_name, created_at, updated_at 
      FROM users WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    
    return result.rows[0] || null;
  }

  static async getAllUsers(): Promise<UserResponse[]> {
    const query = `
      SELECT id, email, first_name, last_name, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    
    return result.rows;
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return CryptoUtils.verifyPassword(password, user.password_hash);
  }
} 