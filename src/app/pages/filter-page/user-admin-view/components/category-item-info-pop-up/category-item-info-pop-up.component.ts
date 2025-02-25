import { Component, computed, ElementRef, signal, ViewChild } from '@angular/core';
import { ItemCategoryService } from '../../../../../services/ItemCategoryService';
import { Item, ItemCategory, ItemService } from '../../../../../services/ItemService';

@Component({
  selector: 'app-category-item-info-pop-up',
  standalone: true,
  imports: [],
  templateUrl: './category-item-info-pop-up.component.html',
})
export class CategoryItemInfoPopUpComponent {
  @ViewChild('menu') menu!: ElementRef<HTMLElement>;
  isVisible = signal(false);
  infoType: 'category'|'item' = 'category';
  categoryType: 'base'|'custom' = 'base';
  info = signal<ItemCategory|Item|null>(null);
  isAddItemToCategoryFormVisible = signal<boolean>(false);
  showSuggestionBox = signal<boolean>(false);
  suggestions = signal<{name: string, id: string}[]>([]);
  itemCategories = computed<ItemCategory[]>(() => {
    const info = this.info();
    if (info === null || this.infoType === 'category') {
      return [];
    }
    const categories = this.itemCategoryService.ItemCategories();
    const c: ItemCategory[] = [];
    for (let i = 0; i < (info as Item).categories.length; i++) {
      for (let j = 0; j < categories.length; j++) {
        if (categories[j].id === (info as Item).categories[i]) {
          c.push(categories[j]);
          break;
        }
      }
    }
    return c;
  })

  constructor(private itemCategoryService: ItemCategoryService, private itemService: ItemService) {}

  async ShowCategoryInfo(categoryId: string, type: 'base'|'custom') {
    if (this.isVisible()) {
      this.Hide();
    }
    this.infoType = 'category';
    this.categoryType = type;
    this.isVisible.set(true);
    const info = await ((type === 'base') ? this.itemCategoryService.GetBaseItemCategory(categoryId) 
    : this.itemCategoryService.GetItemCategory(categoryId)) 
    this.info.set(info);
    if (info === null) {
      this.Hide();
      return;
    }
    document.addEventListener('mousedown', this.OnGlobalMouseDown);
  }
  
  ShowItemInfo(item: Item) {
    if (this.isVisible()) {
      this.Hide();
    }
    this.infoType = 'item';
    this.isVisible.set(true);
    this.info.set({...item});
    document.addEventListener('mousedown', this.OnGlobalMouseDown);
  }
  
  Hide() {
    this.info.set(null);
    this.isVisible.set(false);
    this.showSuggestionBox.set(false);
    this.suggestions.set([]);
    this.isAddItemToCategoryFormVisible.set(false);
    document.removeEventListener('mousedown', this.OnGlobalMouseDown);
  }

  protected GetRarity() {
    const info = this.info();
    if (info === null) {
      return "";
    }
    if (this.infoType === 'category') {
      return "";
    }
    return (info as Item).rarity;
  }

  protected GetBaseCategory() {
    const info = this.info();
    if (info === null) {
      return "";
    }
    if (this.infoType === 'category') {
      return "";
    }
    return (info as Item).baseCategory;
  }

  private lastInput = 0;
  protected OnInput(event: Event) {
    if (event.target === null) {
      return;
    }
    const target = event.target as HTMLInputElement;
    setTimeout(() => {
      const time = performance.now();
      const delta = time - this.lastInput;
      if (delta > 500) {
        this.ShowSuggestions(target.value);
      }
    }, 500);
    this.lastInput = performance.now();
  }

  protected ShowSuggestions(value: string) {
    const items = this.itemService.Items();
    const suggestedItems: {id: string, name: string}[] = [];
    const itemInCategory = this.GetItemsFromCategory();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.name.toLowerCase().includes(value.toLowerCase())) {
        let found = false;
        for (let j = 0; j < itemInCategory.length; j++) {
          if (itemInCategory[j].id === item.id) {
            found = true;
            break;
          }
        }
        if (!found) {
          suggestedItems.push({id: item.id, name: item.name});
        }
      } 
    }
    this.showSuggestionBox.set(true);
    this.suggestions.set(suggestedItems);
  }

  protected async AddItemToCategory(itemId: string) {
    const info = this.info();
    if (info === null || this.infoType !== 'category') {
      return;
    }
    const id = info.id;
    await this.itemService.AddCategoryToItem(itemId, id);
    this.isAddItemToCategoryFormVisible.set(false);
    this.showSuggestionBox.set(false);
    this.suggestions.set([]);
  }

  protected GetItemsFromCategory() {
    const info = this.info();
    if (info === null) {
      return [];
    }
    if (this.infoType === 'item') {
      return [];
    }
    const items = this.itemService.Items();
    const itemsInCategory: Item[] = [];
    for (let i = 0; i < items.length; i++) {
      if (this.categoryType === 'base' && items[i].baseCategory === info.id) {
        itemsInCategory.push(items[i]);
        continue;
      }
      for (let j = 0; j < items[i].categories.length; j++) {
        if (items[i].categories[j] === info.id) {
          itemsInCategory.push(items[i]);
          break;
        }
      }
    }
    return itemsInCategory;
  }

  protected ShowAddItemToCategoryForm() {
    this.isAddItemToCategoryFormVisible.set(true);
  }

  protected CancelAddItem() {
    this.isAddItemToCategoryFormVisible.set(false);
  }

  private OnGlobalMouseDown = (event: Event) => {
    if (event.target === null) {
      return;
    }
    event.stopPropagation();
    if (!this.menu.nativeElement.contains(event.target as HTMLElement)) {
      this.Hide();
    }
  }
}
