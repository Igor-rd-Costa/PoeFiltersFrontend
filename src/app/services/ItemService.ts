import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppComponent } from "../app.component";

export type Item = {
  id: string,
  name: string
}

export type ItemCategory = {
  id: string,
  name: string,
  ignoreItems: boolean
}

@Injectable()
export class ItemService {
  private backend = AppComponent.Backend() + "poe2/item/";

  constructor(private http: HttpClient) {}

  GetItemCategories(includeIgnored: boolean = true) {
    return new Promise<ItemCategory[]>(resolve => {
      this.http.get<ItemCategory[]>(this.backend+"category?includeIgnored="+includeIgnored, {withCredentials: true}).subscribe({
        next: categories => {
          resolve(categories);
        },
        error: err => {
          console.error(err);
          resolve([]);
        }
      })
    });
  }

  UpdateItemCategories() {
    return new Promise<ItemCategory[]>(resolve => {
      this.http.patch<ItemCategory[]>(this.backend+"category/update", {withCredentials: true}).subscribe({
        next: categories => {
          resolve(categories);
        },
        error: err => {
          console.error(err);
          resolve([]);
        }
      })
    });
  }

  UpdateItemCategory(category: ItemCategory) {
    return new Promise<boolean>(resolve => {
      this.http.patch(this.backend+"category", category, {withCredentials: true}).subscribe({
        next: _ => {
          resolve(true);
        },
        error: err => {
          console.error(err);
          resolve(err);
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

  GetItemsById(items: string[]) {
    return new Promise<Item[]>(resolve => {
      this.http.get<Item[]>(this.backend+`?ids=${items}`,{withCredentials: true}).subscribe({
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

}