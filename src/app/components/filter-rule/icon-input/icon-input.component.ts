import { Component, ElementRef, model, ModelSignal, ViewChild } from '@angular/core';
import { iconColors, iconShapes } from '../../../services/FilterService';
import { DropIcon, IconColor, IconShape, IconSize } from '../../../types/FilterTypes';
import { FilterViewComponent } from '../../../pages/filter-page/filter-view/filter-view.component';
import { IconOptionsMenuViewMode } from '../../../pages/filter-page/filter-view/components/icon-options-menu/icon-options-menu.component';

@Component({
  selector: 'app-icon-input',
  standalone: true,
  imports: [],
  templateUrl: './icon-input.component.html',
  styles: `
    :host {
      width: 100%;
    }
    select {
      appearance: none;
    }
  `
})
export class IconInputComponent {
  @ViewChild('menu') menu!: ElementRef<HTMLElement>;
  icon = model.required<DropIcon|null>();
  private oldIconData: DropIcon|null = null;

  SwitchActive() {
    this.icon.update(icon => {
      if (icon === null) {
        if (this.oldIconData !== null) {
          return this.oldIconData;
        }
        return {
          active: true,
          size: 2,
          color: 'Blue',
          shape: 'Circle'
        }
      }
      icon.active = true;
      return icon;
    });
  }
  
  ShowIconMenu() {
    const icon = this.icon();
    if (icon === null) {
      return;
    }
    const selected = {shape: icon.shape, size: icon.size, color: icon.color}
    FilterViewComponent.IconMenu()?.Show(this.menu.nativeElement, IconOptionsMenuViewMode.SHAPE, this.icon as ModelSignal<DropIcon>).subscribe(shape => {
      if (!icon.active) {
        icon.active = true;
      }
      const s = shape as IconShape;
      icon.shape = s;
    })
  }

  ShowColorMenu() {
    const icon = this.icon();
    if (icon === null) {
      return;
    }
    const selected = {shape: icon.shape, size: icon.size, color: icon.color}
    FilterViewComponent.IconMenu()?.Show(this.menu.nativeElement, IconOptionsMenuViewMode.COLOR, this.icon as ModelSignal<DropIcon>).subscribe(color => {
      if (!icon.active) {
        icon.active = true;
      }
      const c = color as IconColor;
      icon.color = c;
    })
  }

  ShowSizeMenu() {
    const icon = this.icon();
    if (icon === null) {
      return;
    }
    const selected = {shape: icon.shape, size: icon.size, color: icon.color}
    FilterViewComponent.IconMenu()?.Show(this.menu.nativeElement, IconOptionsMenuViewMode.SIZE, this.icon as ModelSignal<DropIcon>).subscribe(size => {
      if (!icon.active) {
        icon.active = true;
      }
      const s = size as IconSize;
      icon.size = s;
    })
  }

  GetSelectedShapeStyle() {
    const icon = this.icon();
    if (icon === null) {
      return;
    }
    let posX = 0;
    let posY = 0;
    
    for (let i = 0; i < iconShapes.length; i++) {
      if (iconShapes[i] === icon.shape) {
        posY = -24 * 3 * i;
        break;
      }
    }
    for (let i = 0; i < iconColors.length; i++) {
      if (iconColors[i] === icon.color) {
        posX = (-24 * i);
        break;
      }
    }
    const style = {background: 'url(/PoeFilterIcons.png)', backgroundPosition: `${posX}px ${posY}px`, backgroundSize: '264px 864px'}
    return style;
  }

  GetSelectedColor() {
    const icon = this.icon();
    if (icon === null) {
      return "#000";
    }
    switch (icon.color) {
      case 'Blue': return "#104aa8";
      case 'Green': return "#1b9a13";
      case 'Brown': return "#9b2301";
      case 'Red': return "#fe0d23";
      case 'White': return "#bbcbcf";
      case 'Yellow': return "#ad7a27";
      case 'Cyan': return "#0ea2b7";
      case 'Grey': return "#1d1d1d";
      case 'Orange': return "#f88c00";
      case 'Pink': return "#f36be2";
      case 'Purple': return "#4c0ea2";
    }
  }

  GetSelectedSizeString() {
    const icon = this.icon();
    if (icon === null) {
      return "Large";
    }
    switch (icon.size) {
      case 0: return "Small";
      case 1: return "Medium";
      case 2: return "Large";
    }
  }
}
