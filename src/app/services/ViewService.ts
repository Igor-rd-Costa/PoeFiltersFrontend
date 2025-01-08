import { Injectable, signal } from "@angular/core";

export enum AppView {
  USER_ADMIN,
  FILTER_LOAD, FILTER_STYLES, FILTER_EXPORT, 
  FILTER_VIEW,
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