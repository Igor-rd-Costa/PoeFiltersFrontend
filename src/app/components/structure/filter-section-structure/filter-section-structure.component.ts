import { Component, ElementRef, EventEmitter, model, Output, signal, ViewChild } from '@angular/core';
import { FilterBlockStructureComponent } from "../filter-block-structure/filter-block-structure.component";
import { FilterSectionStructure } from '../../../types/FilterStructureTypes';
import { FilterStructureHelpers } from '../../../utils/FilterStructureHelpers';

@Component({
  selector: 'app-filter-section-structure',
  standalone: true,
  imports: [FilterBlockStructureComponent],
  templateUrl: './filter-section-structure.component.html',
})
export class FilterSectionStructureComponent {
  @ViewChild('nameInput') nameInput!: ElementRef<HTMLElement>;
  section = model.required<FilterSectionStructure>();
  isInEditMode = signal<boolean>(false);
  @Output() delete = new EventEmitter<string>();


  protected OnKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.OnBlur();
    }
  }

  protected OnBlur() {
    const v = this.nameInput.nativeElement.textContent?.trim();
    this.isInEditMode.set(false);
    if (!v || v === "") {
      this.nameInput.nativeElement.textContent = this.section().name;
      return;
    }
    this.section().name = v;
  }

  protected Edit() {
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

  protected Delete() {
    this.delete.emit(this.section().id);
  }

  protected CreateBlock() {
    this.section().blocks.push(FilterStructureHelpers.CreateBlock(false, this.section().blocks.length));
  }

  protected OnBlockDelete(id: string) {
    const s = this.section();
    for (let i = 0; i < s.blocks.length; i++) {
      if (s.blocks[i].id === id) {
        s.blocks.splice(i, 1);
        return;
      }
    }
  }
}
