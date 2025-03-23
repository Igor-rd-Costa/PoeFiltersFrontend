import { AfterViewInit, Component, computed, effect, QueryList, ViewChildren } from '@angular/core';
import { FilterSelectComponent } from "./filter-select/filter-select.component";
import { MenuSectionComponent } from './menu-section/menu-section.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { AppView, ViewService } from '../../../services/ViewService';
import { FilterService } from '../../../services/FilterService';
import { AuthService } from '../../../services/AuthService';
import { FilterGameSelectComponent } from "./filter-game-select/filter-game-select.component";

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [FilterSelectComponent, MenuSectionComponent, MenuItemComponent, FilterGameSelectComponent],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent implements AfterViewInit {
  AppView = AppView;
  @ViewChildren(MenuItemComponent) menuItems!: QueryList<MenuItemComponent>;
  protected filter = computed(() => {
    return this.filterService.Filter();
  });
  protected isAdmin = computed(() => {
    return this.authService.IsAdmin();
  });
  protected user = computed(() => {
    return this.authService.User();
  })

  constructor(private viewService: ViewService, private filterService: FilterService, private authService: AuthService) {
    effect(() => {
      this.SelectItem(this.viewService.View());
    }, {allowSignalWrites: true});
  }
  
  ngAfterViewInit(): void {
    this.menuItems.changes.subscribe(_ => {
      this.SelectItem(this.viewService.View());
    });
  }

  SelectItem(view: AppView) {
    if (!this.menuItems)
      return;
    for (let i = 0; i < this.menuItems.length; i++) {
      const item = this.menuItems.get(i)!;
      if (item.view === view) {
        item.Select();
        continue;
      }
      if (item.IsSelected()) {
        item.Unselect();
      }
    }
  }

  SwitchView(view: AppView, blockId?: string) {
    this.viewService.SetView(view);
    if (blockId) {

    }
  }
}
