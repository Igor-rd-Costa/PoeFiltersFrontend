import { Component } from '@angular/core';
import { ItemService, Item, ItemCategory } from '../../../services/ItemService';

@Component({
  selector: 'app-user-admin-view',
  standalone: true,
  imports: [],
  templateUrl: './user-admin-view.component.html',
})
export class UserAdminViewComponent {
  categories: ItemCategory[] = [];
  items: Item[] = [];

  constructor(private itemService: ItemService) {
    this.GetCategories();
  }

  async GetCategories() {
    const categories = await this.itemService.GetItemCategories();
    this.categories = categories.sort(this.CategoriesSortFn);
  }

  async UpdateCategories() {
    const categories = await this.itemService.UpdateItemCategories();
    this.categories = categories.sort(this.CategoriesSortFn);
  }

  UpdateItems() {
    this.itemService.UpdateItems();
  }

  async ToggleIgnoreItems(id: string) {
    let item: ItemCategory|null = null;
    let i =0;
    for (;i < this.categories.length; i++) {
      if (this.categories[i].id === id) {
        item = this.categories[i];
        break;
      }
    }
    if (item === null) {
      return;
    }
    const newCategory = {...item};
    newCategory.ignoreItems = !newCategory.ignoreItems;
    if (await this.itemService.UpdateItemCategory(newCategory)) {
      this.categories[i] = newCategory;
      this.categories = this.categories.sort(this.CategoriesSortFn)
    }
  }

  CategoriesSortFn(a: ItemCategory, b: ItemCategory) {
    if (a.ignoreItems > b.ignoreItems) {
      return 1;
    }
    return -1;
  }

  GetNotIgnoredCategories() {
    return this.categories.filter(c => c.ignoreItems === false);
  }

  async OnItemCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    console.log("Change", target.value);
    if (target.value === null) {
      this.items = [];
      return;
    }
    this.items = await this.itemService.GetItemsFromCategory(target.value);
  }
}
