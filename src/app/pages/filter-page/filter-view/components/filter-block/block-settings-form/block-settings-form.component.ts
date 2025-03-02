import { AfterViewInit, Component, EventEmitter, model, Output } from '@angular/core';
import { ItemCategoryService } from '../../../../../../services/ItemCategoryService';
import { ItemCategory } from '../../../../../../services/ItemService';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterBlockInfo, FilterBlockRulesType } from '../../../../../../types/FilterTypes';

@Component({
  selector: 'app-block-settings-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './block-settings-form.component.html',
})
export class BlockSettingsFormComponent implements AfterViewInit {
  block = model.required<FilterBlockInfo>();
  FilterBlockRulesType = FilterBlockRulesType;
  settingsForm = new FormGroup({
    name: new FormControl('', {validators: [Validators.required]}),
    imgUrl: new FormControl(''),
    rulesType: new FormControl<FilterBlockRulesType>(FilterBlockRulesType.RULE_FULL, {validators: [Validators.required]}),
    allowedCategories: new FormControl<string[]>([])
  });
  @Output('close') close = new EventEmitter();


  public constructor(private itemCategoryService: ItemCategoryService) {}

  ngAfterViewInit(): void {
    const c = this.settingsForm.controls;
    c.name.setValue(this.block().name);
    c.imgUrl.setValue(this.block().imgSrc);
    c.rulesType.setValue(this.block().rulesType);
    c.allowedCategories.setValue([...this.block().allowedCategories]);
  }

  BaseItemCategories() {
    return this.itemCategoryService.BaseCategories();
  }

  CustomItemCategories() {
    return this.itemCategoryService.ItemCategories();
  }

  IsCategoryIncluded(category: ItemCategory) {
    const allowedCategories = this.settingsForm.controls.allowedCategories.value ?? [];
    for (let i = 0; i < allowedCategories.length; i++) {
      if (allowedCategories[i] === category.id) {
        return true;
      }
    }
    return false;
  }
  
  ToggleIncludedCategories(category: ItemCategory) {
    const allowedCategories = this.settingsForm.controls.allowedCategories.value;
    if (!allowedCategories) {
      return;
    }
    for (let i = 0; i < allowedCategories.length; i++) {
      if (allowedCategories[i] === category.id) {
        allowedCategories.splice(i, 1);
        return;
      }
    }
    allowedCategories.push(category.id);
  }

  SaveBlockInfo(event: SubmitEvent) {
    event.preventDefault();
    if (!this.settingsForm.valid) {
      return;
    }
    const name = this.settingsForm.controls.name.value ?? this.block().name;
    if (name === "") {
      return;
    }
    this.block().name = name;
    this.block().imgSrc = this.settingsForm.controls.imgUrl.value ?? this.block().imgSrc;
    this.block().rulesType = this.settingsForm.controls.rulesType.value ?? this.block().rulesType;
    this.block().allowedCategories = this.settingsForm.controls.allowedCategories.value ?? this.block().allowedCategories;
    this.close.emit();
  }

  CancelEdit(event: MouseEvent) {
    event.stopPropagation();
    this.close.emit();
  }
}
