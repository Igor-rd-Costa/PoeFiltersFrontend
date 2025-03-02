import { AfterViewInit, Component } from '@angular/core';
import { FilterService } from '../../services/FilterService';
import { AppView, ViewService } from '../../services/ViewService';
import { SideMenuComponent } from "./side-menu/side-menu.component";
import { LoadFilterPageComponent } from '../load-filter-page/load-filter-page.component';
import { FilterViewComponent } from './filter-view/filter-view.component';
import { FilterExportViewComponent } from "./filter-export-view/filter-export-view.component";
import { UserAdminViewComponent } from "./user-admin-view/user-admin-view.component";
import { AuthService } from '../../services/AuthService';
import { ItemService } from '../../services/ItemService';
import { ItemCategoryService } from '../../services/ItemCategoryService';

@Component({
  selector: 'app-filter-page',
  standalone: true,
  imports: [SideMenuComponent, LoadFilterPageComponent, FilterViewComponent, FilterExportViewComponent, UserAdminViewComponent],
  templateUrl: './filter-page.component.html',
})
export class FilterPageComponent implements AfterViewInit {
  AppView = AppView;

  constructor(protected authService: AuthService, protected filterService: FilterService, protected viewService: ViewService,
    private itemService: ItemService, private itemCategoryService: ItemCategoryService) {}

  async ngAfterViewInit() {
    if (this.filterService.Filter() === null) {
      this.viewService.SetView(AppView.FILTER_LOAD);
    }
    await this.itemService.Init();
    await this.itemCategoryService.Init();
  }
}
