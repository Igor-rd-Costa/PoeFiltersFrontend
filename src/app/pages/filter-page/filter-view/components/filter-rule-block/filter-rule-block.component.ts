import { Component, ElementRef, Input, model, signal, ViewChild } from '@angular/core';
import { FilterBlockRulesType, FilterRuleBlockInfo, FilterService } from '../../../../../services/FilterService';
import { GetHTMLContentHeight } from '../../../../../utils/helpers';
import { FilterRuleComponent } from '../filter-rule/filter-rule.component';

@Component({
  selector: 'app-filter-rule-block',
  standalone: true,
  imports: [FilterRuleComponent],
  templateUrl: './filter-rule-block.component.html',
  styles: `
    :host {
      width: 100%;
    }

    .hovered {
      @apply bg-mainBright;
    }

    .active > div {
      background-color: #AAAF;
    }
  `
})
export class FilterRuleBlockComponent {
  @ViewChild('wrapper') wrapper!: ElementRef<HTMLElement>;
  @Input() itemCategories: string[] = [];
  @Input({required: true}) blockId: string = "";
  @Input({required: true}) rulesType: FilterBlockRulesType = FilterBlockRulesType.RULE_FULL;
  ruleBlock = model.required<FilterRuleBlockInfo>();
  protected isExpanded = signal<boolean>(false);
  protected isInEditMode = signal<boolean>(false);

  constructor(private filterService: FilterService) {}

  OnDragStart() {
    this.filterService.DragDrop(this.ruleBlock());
  }

  OnDragOver(event: DragEvent) {
    event.preventDefault();
    if (!event.target) {
      return;
    }
    const t = event.target as HTMLElement;
    if (t.id === "filter-rule-drag-target") {
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

  async ToggleExpand() {
    return new Promise<void>(resolve => {
          const expanded = this.isExpanded();
          const icon = this.wrapper.nativeElement.querySelector("#filter-rule-expand-icon");
          const content = this.wrapper.nativeElement.querySelector("#filter-rule-content");
          
          const innerH = GetHTMLContentHeight(content as HTMLElement) + "px";
          if (expanded) {
            icon?.animate([{rotate: "90deg"}, {rotate: "0deg"}], {fill: 'forwards', duration: 150})
            content?.animate([{height: innerH}, {height: 0}], {duration: 150}).addEventListener('finish', () => {
              this.isExpanded.set(false);
              resolve();
            });
          } else {
            icon?.animate([{rotate: "0deg"}, {rotate: "90deg"}], {fill: 'forwards', duration: 150});
            content?.animate([{height: 0}, {height: innerH}], {duration: 150}).addEventListener('finish', () => {
              this.isExpanded.set(true);
              resolve();
            });
          }
        });
  }

  EditRuleBlockInfo(event: MouseEvent) {
    event.stopPropagation();
    this.isInEditMode.set(true);
    if (!this.isExpanded()) {
      this.ToggleExpand();
    }
  }

  Delete() {
    this.filterService.DeleteRuleBlock(this.ruleBlock().id);
  }

  CreateRule() {
    this.filterService.CreateRule(this.blockId, this.ruleBlock().id);
  }

  SaveRuleBlockInfo(event: SubmitEvent) {
    event.preventDefault();
    const form = this.wrapper.nativeElement.querySelector("#filter-rule-wrapper-edit-form") as HTMLElement|null;
    if (!form) {
      return;
    }
    const nameInput = form.querySelector("#filter-rule-wrapper-edit-form-name-input") as HTMLInputElement|null;
    const nameValue = nameInput?.value ?? this.ruleBlock().name;

    this.ruleBlock().name = nameValue;
    this.isInEditMode.set(false);
  }

  CancelEdit(event: MouseEvent) {
    this.isInEditMode.set(false);
  }
}
