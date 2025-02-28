import { AfterViewInit, Component } from '@angular/core';
import { FilterService } from '../../services/FilterService';
import { AppView, ViewService } from '../../services/ViewService';
import { SideMenuComponent } from "./side-menu/side-menu.component";
import { LoadFilterPageComponent } from '../load-filter-page/load-filter-page.component';
import { FilterViewComponent } from './filter-view/filter-view.component';
import { FilterExportViewComponent } from "./filter-export-view/filter-export-view.component";
import { UserAdminViewComponent } from "./user-admin-view/user-admin-view.component";
import { AuthService } from '../../services/AuthService';

@Component({
  selector: 'app-filter-page',
  standalone: true,
  imports: [SideMenuComponent, LoadFilterPageComponent, FilterViewComponent, FilterExportViewComponent, UserAdminViewComponent],
  templateUrl: './filter-page.component.html',
})
export class FilterPageComponent implements AfterViewInit {
  AppView = AppView;

  constructor(protected authService: AuthService, protected filterService: FilterService, protected viewService: ViewService) {}

  ngAfterViewInit(): void {
    if (this.filterService.Filter() === null) {
      this.viewService.SetView(AppView.FILTER_LOAD);
    }
    setTimeout(() => {
      const user = this.authService.User();
      if (user) {
        //this.viewService.SetView(AppView.USER_ADMIN);
      }
    }, 500);
  }
}
