import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  public saveData(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public loadData(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
}
