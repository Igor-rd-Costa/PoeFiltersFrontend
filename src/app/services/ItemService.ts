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

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private backend = AppComponent.Backend() + "poe2/item/";
  private items = signal<Item[]>([]);

  constructor(private http: HttpClient) {}
  
  async Init() {
    this.GetItems();
  }

  Items() {
    return this.items();
  }

  private GetItems() {
    return new Promise<void>(resolve => {
      this.http.get<Item[]>(this.backend, {withCredentials: true}).subscribe({
        next: items => {
          this.items.set(items.sort(this.ItemSortFn));
          resolve();
        },
        error: err => {
          console.error(err);
          resolve();
        }
      })
    });
  }

  GetItemsFromCategory(categoryId: string): Item[] {
    const items = this.items();
    for (let i = 0; i < items.length; i++) {
      if (items[i].baseCategory === categoryId) {
        return items.filter(item => item.baseCategory === categoryId).sort(this.ItemSortFn);
      }
      if (items[i].categories.includes(categoryId)) {
        return items.filter(item => item.categories.includes(categoryId)).sort(this.ItemSortFn);
      }
    }
    return [];
  }

  GetItemsById(itemIds: string[]): Item[] {
    const items = this.items();
    const returnItems: Item[] = [];
    for (let i  = 0; i < itemIds.length; i++) {
      for (let j = 0; j < items.length; j++) {
        if (itemIds[i] === items[j].id) {
          returnItems.push(items[j]);
          break;
        }
      }
    }
    return returnItems;
  }

  UpdateItems() {
    return new Promise<void>(resolve => {
      this.http.patch<Item[]>(this.backend, null, {withCredentials: true}).subscribe({
        next: items => {
          this.items.set(items.sort(this.ItemSortFn));
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

  private ItemSortFn(a: Item, b: Item) {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
  }
}