import { Component, EventEmitter, model, Output, signal, ViewChild } from '@angular/core';
import { ExpandableHeaderComponent } from "../../expandable-header/expandable-header.component";
import { RuleSettingsFormComponent } from '../../filter-rule/rule-settings-form/rule-settings-form.component';
import { FilterRuleStructure } from '../../../types/FilterStructureTypes';

@Component({
  selector: 'app-filter-rule-structure',
  standalone: true,
  imports: [ExpandableHeaderComponent, RuleSettingsFormComponent],
  templateUrl: './filter-rule-structure.component.html',
})
export class FilterRuleStructureComponent {
  @ViewChild(ExpandableHeaderComponent) protected header!: ExpandableHeaderComponent;
  rule = model.required<FilterRuleStructure>();
  protected isInEditMode = signal<boolean>(false);
  @Output() delete = new EventEmitter<string>();

  Edit(event: MouseEvent) {
    event.stopPropagation();
    this.isInEditMode.set(true);
    setTimeout(() => {
      this.header.Expand();
    });
  }

  async OnSettingsClose() {
    await this.header.Shrink();
    this.isInEditMode.set(false);
  }

  Delete(event: MouseEvent) {
    event.stopPropagation();
    this.delete.emit(this.rule().id);
  }
}
