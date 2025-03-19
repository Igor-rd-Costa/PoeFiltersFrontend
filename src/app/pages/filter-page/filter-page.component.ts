import { AfterViewInit, Component, effect } from '@angular/core';
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
import { FilterStructureViewComponent } from "../admin/filter-structure-view/filter-structure-view.component";
import { DefaultFiltersViewComponent } from "../admin/default-filters-view/default-filters-view.component";

@Component({
  selector: 'app-filter-page',
  standalone: true,
  imports: [SideMenuComponent, LoadFilterPageComponent, FilterViewComponent,
    FilterExportViewComponent, UserAdminViewComponent, FilterStructureViewComponent, DefaultFiltersViewComponent],
  templateUrl: './filter-page.component.html',
})
export class FilterPageComponent implements AfterViewInit {
  AppView = AppView;

  constructor(protected authService: AuthService, protected filterService: FilterService, protected viewService: ViewService,
    private itemService: ItemService, private itemCategoryService: ItemCategoryService) {
      effect(() => {
        const view = this.viewService.View();
        const isAdminView = view === AppView.ADMIN_ITEMS || view === AppView.ADMIN_FILTER_STRUCTURE || AppView.ADMIN_DEFAULT_FILTERS;
        const isAuthView = isAdminView || view === AppView.USER_STYLES || view === AppView.FILTER_VIEW || view === AppView.FILTER_EXPORT;
        if ((isAuthView && !this.authService.IsLogged())
        || (isAdminView && !this.authService.IsAdmin())) {
          this.viewService.SetView(AppView.USER_FILTERS);
        }
      }, {allowSignalWrites: true});
    }

  async ngAfterViewInit() {
    if (this.filterService.Filter() === null) {
      this.viewService.SetView(AppView.USER_FILTERS);
    }
    this.viewService.SetView(AppView.ADMIN_DEFAULT_FILTERS);
    await this.itemService.Init();
    await this.itemCategoryService.Init();
  }
}
