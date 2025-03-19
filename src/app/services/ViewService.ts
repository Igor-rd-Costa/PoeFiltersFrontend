import { Injectable, signal } from "@angular/core";

export enum AppView {
  ADMIN_ITEMS, ADMIN_FILTER_STRUCTURE, ADMIN_DEFAULT_FILTERS,
  USER_STYLES, USER_FILTERS,
  FILTER_VIEW, FILTER_EXPORT,
}

@Injectable()
export class ViewService {
  private view = signal<AppView>(AppView.FILTER_VIEW);

  constructor() {
    const viewStr = sessionStorage.getItem("view");
    if (viewStr) {
      const view = parseInt(viewStr);
      this.view.set(view);
    }
  }
  
  View() {
    return this.view();
  }

  SetView(view: AppView) {
    sessionStorage.setItem("view", view.toString());
    this.view.set(view);
  }
}