import { AfterViewInit, Component, signal, ViewChild } from '@angular/core';
import { ItemService, Item, ItemCategory } from '../../../services/ItemService';
import { AuthService } from '../../../services/AuthService';
import { AppView, ViewService } from '../../../services/ViewService';
import { ItemCategoryService } from '../../../services/ItemCategoryService';
import { CategoryItemInfoPopUpComponent } from './components/category-item-info-pop-up/category-item-info-pop-up.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-admin-view',
  standalone: true,
  imports: [CategoryItemInfoPopUpComponent, ReactiveFormsModule],
  templateUrl: './user-admin-view.component.html',
})
export class UserAdminViewComponent implements AfterViewInit {
  @ViewChild(CategoryItemInfoPopUpComponent) infoPopUp!: CategoryItemInfoPopUpComponent;
  baseCategories = signal<ItemCategory[]>([]);
  categories = signal<ItemCategory[]>([]);
  items = signal<Item[]>([]);
  isAddCategoryFormVisible = signal<boolean>(false);
  addCategoryForm = new FormGroup({
    name: new FormControl<string>('', {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]})
  });


  constructor(private itemService: ItemService, private itemCategoryService : ItemCategoryService, private authService: AuthService, private viewService: ViewService) {}
  
  async ngAfterViewInit() {
    const user = this.authService.User();
    if (user === null || user.isAdmin === false) {
      this.viewService.SetView(AppView.FILTER_VIEW);
      return;  
    }
    this.GetData();
  }

  protected ShowAddItemCategoryForm() {
    this.isAddCategoryFormVisible.set(true);
  }

  protected ShowCategoryInfo(categoryId: string, type: 'base'|'custom') {
    this.infoPopUp.ShowCategoryInfo(categoryId, type);
  }

  protected ShowItemInfo(item: Item) {
    this.infoPopUp.ShowItemInfo(item);
  }

  async GetData() {
    this.baseCategories.set((await this.itemCategoryService.GetBaseItemCategories()).sort(this.CategoriesSortFn));
    this.categories.set((await this.itemCategoryService.GetItemCategories()).sort(this.CategoriesSortFn));
    this.items.set(await this.itemService.GetItems());
  }

  async UpdateCategories() {
    this.baseCategories.set((await this.itemCategoryService.UpdateBaseItemCategories()).sort(this.CategoriesSortFn));
  }

  async AddCategory(event: SubmitEvent) {
    event.preventDefault();
    if (!this.addCategoryForm.valid) {
      return;
    }
    const categoryName = this.addCategoryForm.controls.name.value;
    if (categoryName) {
      const id = await this.itemCategoryService.AddItemCategory(categoryName);
      if (id !== null) {
        const categories = this.categories();
        categories.push({id: id, name: categoryName});
        this.categories.set(categories.sort(this.CategoriesSortFn));
      }
    }
  }

  UpdateItems() {
    this.itemService.UpdateItems();
  }

  CategoriesSortFn(a: ItemCategory, b: ItemCategory) {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  }
}
