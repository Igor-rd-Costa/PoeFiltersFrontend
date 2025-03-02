import { AfterViewInit, Component, effect, QueryList, ViewChildren } from '@angular/core';
import { FilterSelectComponent } from "./filter-select/filter-select.component";
import { MenuSectionComponent } from './menu-section/menu-section.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { AppView, ViewService } from '../../../services/ViewService';
import { FilterService } from '../../../services/FilterService';
import { FilterInfo } from '../../../types/FilterTypes';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [FilterSelectComponent, MenuSectionComponent, MenuItemComponent],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent implements AfterViewInit {
  AppView = AppView;
  @ViewChildren(MenuItemComponent) menuItems!: QueryList<MenuItemComponent>;
  protected filter: FilterInfo|null = null;

  constructor(private viewService: ViewService, private filterService: FilterService) {
    effect(() => {
      const view = this.viewService.View();
      this.SelectItem(view);
    }, {allowSignalWrites: true})
    this.filter = this.filterService.Filter();
  }

  ngAfterViewInit(): void {
      
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
