import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storage: Storage = localStorage;

  public delete(name: string): void {
    this.storage.removeItem(name);
  }

  public get(name: string): string | null {
    return this.storage.getItem(name);
  }

  public getDateTime(key: string): Date | null {
    const value: string = this.get(key);

    if (value) {
      try {
        return new Date(Number(value));
      } catch (e) {
      }
    }

    return null;
  }

  public getNumber(key: string): number | null {
    const value: string = this.get(key);
    const num: number = parseFloat(value);

    return isNaN(num) ? null : num;
  }

  public getObject(name: string): object | null {
    const objJSON: string = this.get(name);

    try {
      return JSON.parse(objJSON);
    } catch (e) {
      console.error(`Local storage service. Bad parsing localstorage object [${name}]`);
      console.error(e);
      return null;
    }
  }

  public set(name: string, value: any): void {
    this.storage.setItem(name, value);
  }

  public setObject(name: string, value: object): void {
    let objJSON: string = null;

    try {
      objJSON = JSON.stringify(value);
      this.set(name, objJSON);
    } catch (e) {
      console.error(`Local storage service. Bad stringify localstorage object [${name}].`);
      console.error(`Object [${name}] not saved to local storage.`);
      console.error(e);
    }
  }
}
