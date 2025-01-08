import { Component, effect, ElementRef, Input, signal, ViewChild } from '@angular/core';
import { AppView } from '../../../../services/ViewService';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [],
  templateUrl: './menu-item.component.html',
  styles: `:host { width: 100%;}` 
})
export class MenuItemComponent {
  @ViewChild("item") item!: ElementRef<HTMLElement>;
  @Input() imgSrc: string = "";
  @Input() content: string = "";
  @Input() view!: AppView;
  protected selected = signal(false);

  constructor() {
    effect(() => {
      const item = this.item.nativeElement;
      if (!item)
        return;
      const isSelected = item.classList.contains("selected");
      if (isSelected && !this.selected()) {
        item.classList.remove("selected");
      } else if (!isSelected && this.selected()) {
        item.classList.add("selected");
      }
    })
  }

  Select() {
    this.selected.set(true);
  }

  Unselect() {
    this.selected.set(false);
  }

  IsSelected() {
    return this.selected();
  }
}
