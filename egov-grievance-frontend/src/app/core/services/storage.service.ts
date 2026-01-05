// src/app/core/services/storage.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // ================= TOKEN =================
  setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(environment.storageKeys.token, token);
    }
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(environment.storageKeys.token);
  }

  removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem(environment.storageKeys.token);
    }
  }

  // ================= USER ID =================
  setUserId(userId: number): void {
    if (this.isBrowser) {
      localStorage.setItem(environment.storageKeys.userId, userId.toString());
    }
  }

  getUserId(): number | null {
    if (!this.isBrowser) return null;
    const userId = localStorage.getItem(environment.storageKeys.userId);
    return userId ? Number(userId) : null;
  }

  removeUserId(): void {
    if (this.isBrowser) {
      localStorage.removeItem(environment.storageKeys.userId);
    }
  }

  // ================= USER OBJECT =================
  setUser<T>(user: T): void {
    if (this.isBrowser) {
      localStorage.setItem(environment.storageKeys.user, JSON.stringify(user));
    }
  }

  getUser<T>(): T | null {
    if (!this.isBrowser) return null;
    const user = localStorage.getItem(environment.storageKeys.user);
    return user ? JSON.parse(user) : null;
  }

  removeUser(): void {
    if (this.isBrowser) {
      localStorage.removeItem(environment.storageKeys.user);
    }
  }

  // ================= CLEAR ALL =================
  clearAll(): void {
    if (this.isBrowser) {
      localStorage.clear();
    }
  }
}
