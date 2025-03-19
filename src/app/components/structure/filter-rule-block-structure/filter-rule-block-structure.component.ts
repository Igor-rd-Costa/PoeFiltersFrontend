import { Component, EventEmitter, Input, model, Output, signal, ViewChild } from '@angular/core';
import { RuleBlockSettingsFormComponent } from '../../filter-rule-block/rule-block-settings-form/rule-block-settings-form.component';
import { ExpandableHeaderComponent } from '../../expandable-header/expandable-header.component';
import { FilterRuleStructureComponent } from "../filter-rule-structure/filter-rule-structure.component";
import { FilterStructureHelpers } from '../../../utils/FilterStructureHelpers';
import { FilterRuleBlockStructure } from '../../../types/FilterStructureTypes';

@Component({
  selector: 'app-filter-rule-block-structure',
  standalone: true,
  imports: [RuleBlockSettingsFormComponent, ExpandableHeaderComponent, FilterRuleStructureComponent],
  templateUrl: './filter-rule-block-structure.component.html',
})
export class FilterRuleBlockStructureComponent {
  @ViewChild(ExpandableHeaderComponent) header!: ExpandableHeaderComponent;
  ruleBlock = model.required<FilterRuleBlockStructure>();
  isInEditMode = signal<boolean>(false);
  @Input({required: true}) blockId: string = "";
  @Output() delete = new EventEmitter<string>();

  protected Edit(event: MouseEvent) {
    event.stopPropagation();
    this.isInEditMode.set(true);
    setTimeout(() => {
      this.header.Expand();
    });
  }

  protected Delete(event: MouseEvent) {
    event.stopPropagation();
    this.delete.emit(this.ruleBlock().id);
  }

  protected OnRuleDelete(id: string) {
    const rb = this.ruleBlock();
    for (let i = 0; i < rb.rules.length; i++) {
      if (rb.rules[i].id === id) {
        rb.rules.splice(i, 1);
        return;
      }
    }
  }

  protected async OnSettingsClose() {
    await this.header.Shrink();
    this.isInEditMode.set(false);
  }

  protected CreateRule() {
    this.ruleBlock().rules.push(FilterStructureHelpers.CreateRule(this.ruleBlock().rules.length));
  }
}
