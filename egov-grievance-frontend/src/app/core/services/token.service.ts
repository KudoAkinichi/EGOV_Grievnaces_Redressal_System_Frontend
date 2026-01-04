// src/app/core/services/token.service.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserRole } from '../models/user.model';

interface JwtPayload {
  sub: string; // email
  role: UserRole;
  userId: number;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  /**
   * Decode JWT token
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) {
      return true;
    }

    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate < new Date();
  }

  /**
   * Get user role from token
   */
  getRoleFromToken(token: string): UserRole | null {
    const decoded = this.decodeToken(token);
    return decoded?.role || null;
  }

  /**
   * Get user email from token
   */
  getEmailFromToken(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.sub || null;
  }

  /**
   * Get user ID from token
   */
  getUserIdFromToken(token: string): number | null {
    const decoded = this.decodeToken(token);
    return decoded?.userId || null;
  }

  /**
   * Get token expiration date
   */
  getTokenExpirationDate(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (!decoded) {
      return null;
    }
    return new Date(decoded.exp * 1000);
  }

  /**
   * Get time until token expiration (in seconds)
   */
  getTimeUntilExpiration(token: string): number | null {
    const expirationDate = this.getTokenExpirationDate(token);
    if (!expirationDate) {
      return null;
    }

    const now = new Date().getTime();
    const exp = expirationDate.getTime();
    return Math.floor((exp - now) / 1000);
  }

  /**
   * Check if token will expire soon (within 5 minutes)
   */
  isTokenExpiringSoon(token: string): boolean {
    const timeUntilExpiration = this.getTimeUntilExpiration(token);
    if (timeUntilExpiration === null) {
      return true;
    }
    return timeUntilExpiration < 300; // 5 minutes
  }
}
