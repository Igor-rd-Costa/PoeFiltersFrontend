import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menu-section',
  standalone: true,
  imports: [],
  templateUrl: './menu-section.component.html',
  styles: `
    :host {
      width: 100%;
    }
  `
})
export class MenuSectionComponent {
  @Input() heading: string = "";
}
