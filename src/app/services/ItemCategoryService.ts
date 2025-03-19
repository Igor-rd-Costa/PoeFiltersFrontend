import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { AppComponent } from "../app.component";
import { ItemCategory } from "./ItemService";


@Injectable()
export class ItemCategoryService {
  private readonly backend = AppComponent.Backend() + "poe2/item-category/";
  private baseCategories = signal<ItemCategory[]>([]);
  private categories = signal<ItemCategory[]>([]);

  constructor(private http: HttpClient) {}
  
  async Init() {
    await this.GetBaseItemCategories();
    await this.GetItemCategories();
  }

  ItemCategories() {
    return this.categories();
  }

  BaseCategories() {
    return this.baseCategories();
  }

  private GetItemCategories() {
    return new Promise<void>(resolve => {
      this.http.get<ItemCategory[]>(this.backend+"custom", {withCredentials: true}).subscribe({
        next: categories => {
          this.categories.set(categories.sort(this.CategorySortFn));
          resolve();
        },
        error: err => {
          console.error(err);
          resolve();
        }
      })
    });
  }
  
  private GetBaseItemCategories() {
    return new Promise<void>(resolve => {
      this.http.get<ItemCategory[]>(this.backend+"base", {withCredentials: true}).subscribe({
        next: categories => {
          this.baseCategories.set(categories.sort(this.CategorySortFn));
          resolve();
        },
        error: err => {
          console.error(err);
          resolve();
        }
      })
    });
  }

  GetBaseItemCategory(id: string) {
    return new Promise<ItemCategory|null>(resolve => {
      const baseCategories = this.baseCategories();
      for (let i = 0; i < baseCategories.length; i++) {
        if (baseCategories[i].id === id) {
          resolve(baseCategories[i]);
          return;
        }
      }
      this.http.get<ItemCategory|null>(this.backend+`base?id=${id}`, {withCredentials: true}).subscribe({
        next: category => {
          resolve(category);
        },
        error: err => {
          console.error(err);
          resolve(null);
        }
      })
    });
  }

  GetItemCategory(id: string) {
    return new Promise<ItemCategory|null>(resolve => {
      this.http.get<ItemCategory|null>(this.backend+`custom?id=${id}`, {withCredentials: true}).subscribe({
        next: category => {
          resolve(category);
        },
        error: err => {
          console.error(err);
          resolve(null);
        }
      })
    });
  }

  AddItemCategory(categoryName: string) {
    return new Promise<void>(resolve => {
      this.http.post<string>(this.backend+"custom", {categoryName}, {withCredentials: true, responseType: 'text' as 'json'}).subscribe({
        next: id => {
          const categories = this.ItemCategories();
          categories.push({id: id, name: categoryName});
          this.categories.set(categories.sort(this.CategorySortFn));
          resolve();
        },
        error: err => {
          console.error(err);
          resolve();
        }
      })
    });
  }

  UpdateBaseItemCategories() {
    return new Promise<void>(resolve => {
      this.http.patch<ItemCategory[]>(this.backend+"base", {}, {withCredentials: true}).subscribe({
        next: categories => {
          this.baseCategories.set(categories.sort(this.CategorySortFn));
          resolve();
        },
        error: err => {
          console.error(err);
          resolve();
        }
      })
    });
  }

  private CategorySortFn(a: ItemCategory, b: ItemCategory) {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
  }
}