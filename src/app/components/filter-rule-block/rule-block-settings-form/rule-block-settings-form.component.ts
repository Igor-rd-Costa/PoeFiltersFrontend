import { AfterViewInit, Component, EventEmitter, model, Output } from '@angular/core';
import { FilterRuleBlock, FilterRuleType } from '../../../types/FilterTypes';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterRuleBlockStructure } from '../../../types/FilterStructureTypes';

@Component({
  selector: 'app-rule-block-settings-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './rule-block-settings-form.component.html',
})
export class RuleBlockSettingsFormComponent implements AfterViewInit {
  ruleBlock = model.required<FilterRuleBlock|FilterRuleBlockStructure>();
  @Output('close') close = new EventEmitter();
  FilterRuleType = FilterRuleType;
  settingsForm = new FormGroup({
    name: new FormControl('', {validators: [Validators.required]}),
    rulesType: new FormControl<FilterRuleType>(FilterRuleType.RULE_FULL, {validators: [Validators.required]}),
    allowUserCreatedRules: new FormControl<boolean>(false, {validators: [Validators.required]})
  })

  ngAfterViewInit(): void {
    this.settingsForm.controls.name.setValue(this.ruleBlock().name);
    this.settingsForm.controls.rulesType.setValue(this.ruleBlock().rulesType);
    this.settingsForm.controls.allowUserCreatedRules.setValue(this.ruleBlock().allowUserCreatedRules);
  } 

  SaveRuleBlockInfo(event: SubmitEvent) {
    event.preventDefault();
    if (!this.settingsForm.valid) {
      return;
    }

    const name = this.settingsForm.controls.name.value ?? this.ruleBlock().name;
    if (name === "") {
      return;
    }
    const ruleType = this.settingsForm.controls.rulesType.value ?? this.ruleBlock().rulesType;
    const allowUserCreatedRules = this.settingsForm.controls.allowUserCreatedRules.value ?? this.ruleBlock().allowUserCreatedRules;
    
    this.ruleBlock().name = name;
    this.ruleBlock().rulesType = ruleType;
    this.ruleBlock().allowUserCreatedRules = allowUserCreatedRules;
    this.close.emit();
  }

  CancelEdit() {
    this.close.emit();
  }
}
