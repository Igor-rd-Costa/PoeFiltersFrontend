import { AfterViewInit, Component, EventEmitter, model, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterRule } from '../../../types/FilterTypes';
import { FilterRuleStructure } from '../../../types/FilterStructureTypes';

@Component({
  selector: 'app-rule-settings-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './rule-settings-form.component.html',
})
export class RuleSettingsFormComponent implements AfterViewInit {
  rule = model.required<FilterRule|FilterRuleStructure>();
  @Output('close') close = new EventEmitter();
  settingsForm = new FormGroup({
    name: new FormControl('', {validators: [Validators.required]}),
    imgUrl: new FormControl('')
  });

  ngAfterViewInit(): void {
    this.settingsForm.controls.name.setValue(this.rule().name);
    this.settingsForm.controls.imgUrl.setValue(this.rule().imgSrc);
  }

  SaveRuleInfo(event: SubmitEvent) {
    event.preventDefault();
    if (!this.settingsForm.valid) {
      return;
    }
    
    const nameValue = this.settingsForm.controls.name.value ?? this.rule().name;
    if (nameValue === "") {
      return;
    }
    const imgValue = this.settingsForm.controls.imgUrl.value ?? this.rule().imgSrc;

    this.rule().name = nameValue;
    this.rule().imgSrc = imgValue;
    this.close.emit();
  }

  CancelEdit(event: MouseEvent) {
    event.stopPropagation();
    this.close.emit();
  }
}
