import { AfterViewInit, Component, computed, signal, ViewChild } from '@angular/core';
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
  baseCategories = computed(() => {
    return this.itemCategoryService.BaseCategories();
  });

  categories = computed(() => {
    return this.itemCategoryService.ItemCategories();
  });
  items = computed(() => {
    return this.itemService.Items();
  });
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

  async UpdateCategories() {
    await this.itemCategoryService.UpdateBaseItemCategories();
  }

  async AddCategory(event: SubmitEvent) {
    event.preventDefault();
    if (!this.addCategoryForm.valid) {
      return;
    }
    const categoryName = this.addCategoryForm.controls.name.value;
    if (categoryName) {
      await this.itemCategoryService.AddItemCategory(categoryName);
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
