import { Component, ElementRef, model, ViewChild } from '@angular/core';
import { iconColors, iconShapes } from '../../../../../../services/FilterService';
import { FilterViewComponent } from '../../../filter-view.component';
import { IconOptionsMenuViewMode } from '../../../components/icon-options-menu/icon-options-menu.component';
import { DropIcon, IconColor, IconShape, IconSize } from '../../../../../../types/FilterTypes';

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
  icon = model.required<DropIcon>();
  
  SwitchActive() {
    this.icon().active = !this.icon().active;
  }
  
  ShowIconMenu() {
    const selected = {shape: this.icon().shape, size: this.icon().size, color: this.icon().color}
    FilterViewComponent.IconMenu()?.Show(this.menu.nativeElement, IconOptionsMenuViewMode.SHAPE, this.icon).subscribe(shape => {
      if (!this.icon().active) {
        this.icon().active = true;
      }
      const s = shape as IconShape;
      this.icon().shape = s;
    })
  }

  ShowColorMenu() {
    const selected = {shape: this.icon().shape, size: this.icon().size, color: this.icon().color}
    FilterViewComponent.IconMenu()?.Show(this.menu.nativeElement, IconOptionsMenuViewMode.COLOR, this.icon).subscribe(color => {
      if (!this.icon().active) {
        this.icon().active = true;
      }
      const c = color as IconColor;
      this.icon().color = c;
    })
  }

  ShowSizeMenu() {
    const selected = {shape: this.icon().shape, size: this.icon().size, color: this.icon().color}
    FilterViewComponent.IconMenu()?.Show(this.menu.nativeElement, IconOptionsMenuViewMode.SIZE, this.icon).subscribe(size => {
      if (!this.icon().active) {
        this.icon().active = true;
      }
      const s = size as IconSize;
      this.icon().size = s;
    })
  }

  GetSelectedShapeStyle() {
    let posX = 0;
    let posY = 0;
    
    for (let i = 0; i < iconShapes.length; i++) {
      if (iconShapes[i] === this.icon().shape) {
        posY = -24 * 3 * i;
        break;
      }
    }
    for (let i = 0; i < iconColors.length; i++) {
      if (iconColors[i] === this.icon().color) {
        posX = (-24 * i);
        break;
      }
    }
    const style = {background: 'url(/PoeFilterIcons.png)', backgroundPosition: `${posX}px ${posY}px`, backgroundSize: '264px 864px'}
    return style;
  }

  GetSelectedColor() {
    switch (this.icon().color) {
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
    switch (this.icon().size) {
      case 0: return "Small";
      case 1: return "Medium";
      case 2: return "Large";
    }
  }
}
