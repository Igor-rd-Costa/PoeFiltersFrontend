import { Component, EventEmitter, model, Output, signal, ViewChild } from '@angular/core';
import { LargeExpandableHeaderComponent } from "../../large-expandable-header/large-expandable-header.component";
import { FilterRuleItemType } from '../../../types/FilterTypes';
import { FilterRuleStructureComponent } from "../filter-rule-structure/filter-rule-structure.component";
import { FilterRuleBlockStructureComponent } from "../filter-rule-block-structure/filter-rule-block-structure.component";
import { BlockSettingsFormComponent } from '../../filter-block/block-settings-form/block-settings-form.component';
import { FilterBlockStructure, FilterRuleBlockStructure, FilterRuleStructure } from '../../../types/FilterStructureTypes';
import { FilterStructureHelpers } from '../../../utils/FilterStructureHelpers';

@Component({
  selector: 'app-filter-block-structure',
  standalone: true,
  imports: [LargeExpandableHeaderComponent, FilterRuleStructureComponent, FilterRuleBlockStructureComponent, BlockSettingsFormComponent],
  templateUrl: './filter-block-structure.component.html',
})
export class FilterBlockStructureComponent {
  @ViewChild(LargeExpandableHeaderComponent) private header!: LargeExpandableHeaderComponent;
  block = model.required<FilterBlockStructure>();
  protected FilterRuleItemType = FilterRuleItemType;
  protected isInEditMode = signal<boolean>(false);
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
    this.delete.emit(this.block().id);
  }

  protected OnRuleDelete(id: string) {
    const b = this.block();
    for (let i = 0; i < b.rules.length; i++) {
      if (b.rules[i].id === id) {
        b.rules.splice(i, 1);
        return;
      }
    }
  }

  protected OnSettingsClose() {
    this.isInEditMode.set(false);
  }

  protected CreateRule() {
    this.block().rules.push(FilterStructureHelpers.CreateRule(this.block().rules.length));
  }
  
  protected CreateRuleBlock() {
    this.block().rules.push(FilterStructureHelpers.CreateRuleBlock(this.block().rulesType, this.block().rules.length));
  }

  protected CastToRule(r: FilterRuleBlockStructure|FilterRuleStructure): FilterRuleStructure {
    return r as FilterRuleStructure;
  }

  protected CastToRuleBlock(r: FilterRuleBlockStructure|FilterRuleStructure): FilterRuleBlockStructure {
    return r as FilterRuleBlockStructure;
  }
}
