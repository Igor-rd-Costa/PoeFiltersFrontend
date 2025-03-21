import { AfterViewInit, Component, ElementRef, Input, model, signal, ViewChild } from '@angular/core';
import { FilterBlockComponent } from '../filter-block/filter-block.component';
import { FilterSection } from '../../types/FilterTypes';
import { FilterService } from '../../services/FilterService';
import { AuthService } from '../../services/AuthService';
import FilterHelpers from '../../utils/FilterHelpers';

@Component({
  selector: 'app-filter-section',
  standalone: true,
  imports: [FilterBlockComponent],
  templateUrl: './filter-section.component.html',
  styles: `
    :host {
      width: 100%;
    }

    .active > div {
      background-color: #AAAF;
    }
  `
})
export class FilterSectionComponent implements AfterViewInit {
  @ViewChild('nameInput') nameInput!: ElementRef<HTMLElement>
  section = model.required<FilterSection>();
  @Input() editable: boolean = false;
  protected isInEditMode = signal<boolean>(false);

  constructor(private filterService: FilterService, protected authService: AuthService) {}
  
  ngAfterViewInit(): void {
    const rect = this.nameInput.nativeElement.getBoundingClientRect();
    this.nameInput.nativeElement.parentElement!.style.minWidth = rect.width + 'px';
  }

  CreateBlock() {
    if (!this.editable) {
      return;
    }
    const s = this.section();
    s.blocks.push(FilterHelpers.CreateBlock(false, s.blocks.length));
  }

  OnDragOver(event: DragEvent) {
    event.preventDefault();
    if (!event.target) {
      return;
    }
    const t = event.target as HTMLElement;
    if (t.id === "filter-block-drag-target" && !t.classList.contains('active')) {
      t.classList.add('active');
    }
  }

  OnMouseLeave(event: MouseEvent) {
    if (!event.target) {
      return;
    }
    const t = event.target as HTMLElement;
    t.classList.remove('active');
  }

  Edit() {
    this.isInEditMode.set(true);
    setTimeout(() => {
      this.nameInput.nativeElement.focus();
      const s = window.getSelection();    
      if (s && s.anchorNode) {
        s.anchorNode.textContent = s.anchorNode.textContent!.trim();
        const t = s.anchorNode.textContent 
        const r = new Range();
        r.setStart(s.anchorNode, t.length);
        s.removeAllRanges();
        s.addRange(r)
      }
    });
  }

  Delete() {
    //this.filterService.DeleteSection(this.section().id);
  }

  OnBlur() {
    const v = this.nameInput.nativeElement.textContent?.trim();
    this.isInEditMode.set(false);
    if (!v) {
      this.nameInput.nativeElement.textContent = this.section.name;
      return;
    }
    this.section().name = v;
  }

  OnKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.OnBlur();
    }
  }
}
