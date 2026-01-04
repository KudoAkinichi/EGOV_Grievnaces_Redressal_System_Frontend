// src/app/core/services/storage.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  // ================= TOKEN =================
  setToken(token: string): void {
    localStorage.setItem(environment.storageKeys.token, token);
  }

  getToken(): string | null {
    return localStorage.getItem(environment.storageKeys.token);
  }

  removeToken(): void {
    localStorage.removeItem(environment.storageKeys.token);
  }

  // ================= USER ID =================
  setUserId(userId: number): void {
    localStorage.setItem(environment.storageKeys.userId, userId.toString());
  }

  getUserId(): number | null {
    const userId = localStorage.getItem(environment.storageKeys.userId);
    return userId ? Number(userId) : null;
  }

  removeUserId(): void {
    localStorage.removeItem(environment.storageKeys.userId);
  }

  // ================= USER OBJECT =================
  setUser<T>(user: T): void {
    localStorage.setItem(environment.storageKeys.user, JSON.stringify(user));
  }

  getUser<T>(): T | null {
    const user = localStorage.getItem(environment.storageKeys.user);
    return user ? JSON.parse(user) : null;
  }

  removeUser(): void {
    localStorage.removeItem(environment.storageKeys.user);
  }

  // ================= CLEAR ALL =================
  clearAll(): void {
    this.removeToken();
    this.removeUserId();
    this.removeUser();
  }

  // ================= SESSION STORAGE =================
  setSessionItem(key: string, value: unknown): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSessionItem<T>(key: string): T | null {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeSessionItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clearSessionStorage(): void {
    sessionStorage.clear();
  }

  // ================= AUTH STATE =================
  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getUserId();
  }
}
