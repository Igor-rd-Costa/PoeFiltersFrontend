import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { AppComponent } from "../app.component";

export type Item = {
  id: string,
  name: string,
  rarity: string
  baseCategory: string,
  categories: string[],
}

export type ItemCategory = {
  id: string,
  name: string
}

@Injectable()
export class ItemService {
  private backend = AppComponent.Backend() + "poe2/item/";
  private items = signal<Item[]>([]);

  constructor(private http: HttpClient) {}

  Items() {
    return this.items();
  }

  GetItems() {
    return new Promise<Item[]>(resolve => {
      this.http.get<Item[]>(this.backend, {withCredentials: true}).subscribe({
        next: items => {
          this.items.set(items);
          resolve(items);
        },
        error: err => {
          console.error(err);
          resolve([]);
        }
      })
    });
  }

  GetItemsFromCategory(categoryId: string) {
    return new Promise<Item[]>(resolve => {
      this.http.get<Item[]>(this.backend+`?category=${categoryId}`, {withCredentials: true}).subscribe({
        next: items => {
          resolve(items);
        },
        error: err => {
          console.error(err);
          resolve([]);
        }
      })
    });
  }

  GetItemsById(itemIds: string[]) {
    return new Promise<Item[]>(resolve => {
      this.http.get<Item[]>(this.backend+`?ids=${itemIds}`,{withCredentials: true}).subscribe({
        next: items => {
          resolve(items);
        },
        error: err => {
          console.error(err);
          resolve([]);
        }
      })
    });
  }

  UpdateItems() {
    return new Promise<void>(resolve => {
      this.http.patch(this.backend, null, {withCredentials: true}).subscribe({
        next: _ => {
          resolve();
        },
        error: err => {
          console.error(err);
          resolve();
        }
      })
    })
  }

  AddCategoryToItem(itemId: string, categoryId: string) {
    return new Promise<boolean>(resolve => {
      this.http.patch(this.backend+'categories', {id: itemId, categoryId}, {withCredentials: true}).subscribe({
        next: _ => {
          const items = this.items();
          for (let i = 0; i < items.length; i++) {
            if (items[i].id === itemId) {
              items[i].categories.push(categoryId);
              break;
            }
          }
          resolve(true);
        },
        error: err => {
          console.error(err);
          resolve(false);
        }
      })
    })
  }
}