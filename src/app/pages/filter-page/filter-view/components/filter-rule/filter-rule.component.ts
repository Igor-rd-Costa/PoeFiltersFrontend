import { AfterViewInit, Component, computed, effect, ElementRef, Input, model, signal, ViewChild } from '@angular/core';
import { GetHTMLContentHeight } from '../../../../../utils/helpers';
import { FilterService } from '../../../../../services/FilterService';
import { ColorInputComponent } from './color-input/color-input.component';
import { IconInputComponent } from "./icon-input/icon-input.component";
import { SoundInputComponent } from "./sound-input/sound-input.component";
import { PlayEffectInputComponent } from "./play-effect-input/play-effect-input.component";
import { ItemService, Item, ItemCategory } from '../../../../../services/ItemService';
import { BaseTypeInputComponent } from './base-type-input/base-type-input.component';
import { FontSizeInputComponent } from "./font-size-input/font-size-input.component";
import { RuleSettingsFormComponent } from "./rule-settings-form/rule-settings-form.component";
import { Color, ColorRGBA, FilterRuleType, FilterRuleInfo, RuleStyle } from '../../../../../types/FilterTypes';

@Component({
  selector: 'app-filter-rule',
  standalone: true,
  imports: [ColorInputComponent, IconInputComponent, SoundInputComponent, PlayEffectInputComponent, BaseTypeInputComponent, FontSizeInputComponent, RuleSettingsFormComponent],
  templateUrl: './filter-rule.component.html',
})
export class FilterRuleComponent implements AfterViewInit {
  @ViewChild("wrapper") wrapper!: ElementRef<HTMLElement>;
  @Input({required: true}) itemCategories: string[] = [];
  @Input({required: true}) ruleType: FilterRuleType = FilterRuleType.RULE_FULL;
  rule = model.required<FilterRuleInfo>();
  ruleStyle = computed(() => {
    const r = this.rule();
    return (r.style as RuleStyle);
  });
  isExpanded = signal<boolean>(false);
  isInEditMode = signal<boolean>(false);
  previewStyle = signal<{
    fontSize: string,
    color: string,
    borderColor: string,
    backgroundColor: string,
  }>({fontSize: '16px', color: 'rgb(0, 0, 0)', borderColor: 'rgb(0, 0, 0)', backgroundColor: 'rgb(0, 0, 0)'});
  items = computed(() => {
    const itemIds = this.rule().items;
    return this.itemService.GetItemsById(itemIds);
  });
  categories: ItemCategory[] = [];

  constructor(private itemService: ItemService, private filterService: FilterService) {}

  ngAfterViewInit() {
    if (this.rule().items.length === 0) {
      this.rule().state = "Disabled";
    }
    if (this.rule().items.length > 0) {
      
    }
    this.UpdatePreviewStyle();
  }

  OnTextColorInputChange(value: ColorRGBA) {
    (this.rule().style as RuleStyle).textColor = {...value, active: true};
    this.UpdatePreviewStyle();
  }

  OnBorderColorInputChange(value: ColorRGBA) {
    (this.rule().style as RuleStyle).borderColor = {...value, active: true};
    this.UpdatePreviewStyle();
  }

  OnBackgroundColorInputChange(value: ColorRGBA) {
    (this.rule().style as RuleStyle).backgroundColor = {...value, active: true};
    this.UpdatePreviewStyle();
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

  protected SwitchState() {
    if (this.rule().items.length === 0 ) {
      this.rule().state = "Disabled";
      return;
    }
    if (this.rule().state === "Show") {
      this.rule().state = "Hide";
    } else if (this.rule().state === "Hide") {
      this.rule().state = "Disabled";
    } else {
      this.rule().state = "Show";
    }
  }

  ColorOrDefault(color: Color|null, df: Color) {
    if (color) {
      return color;
    }
    return df;
  }

  async EditRuleInfo(event: MouseEvent) {
    event.stopPropagation();
    if (this.isInEditMode())
    {
      return;
    }
    if (!this.isExpanded()) {
      await this.ToggleExpand();
    }
    this.isInEditMode.set(true);  
  }

  AddBaseType(item: Item) {
    for (let i = 0; i < this.rule().items.length; i++) {
      if (this.rule().items[i] === item.id) {
        return;
      }
    }
    this.rule().items.push(item.id);
    this.items().push(item);
    if (this.rule().state === "Disabled") {
      this.rule().state = "Show";
    }
  }

  RemoveItem(item: Item) {
    for (let i = 0; i < this.rule().items.length; i++) {
      if (this.rule().items[i] === item.id) {
        this.rule().items.splice(i, 1);
        break;
      }
    }
    if (this.rule().items.length === 0) {
      this.rule().state = "Disabled";
    }
  }
  
  protected GetStateButtomColor() {
    switch(this.rule().state) {
      case "Hide":
      case "Show": return "#B07FFFFF";
      case "Disabled": return "#703FACFF";
    }
  }

  OnFontSizeChange(fontSize: number) {
    (this.rule().style as RuleStyle).fontSize = fontSize;
    this.UpdatePreviewStyle();
  }

  protected ResetStyles() {
    this.rule().style = this.filterService.GetDefaultRuleStyle();
    this.UpdatePreviewStyle();
  }

  protected Delete() {
    this.filterService.DeleteRule(this.rule().id);
    this.UpdatePreviewStyle();
  }

  protected OnDragStart() {
    this.filterService.DragDrop(this.rule());
  }

  private UpdatePreviewStyle() {
    const style = this.rule().style;
    if (typeof style === 'string') {
      return;  
    }
    const tx = style.textColor;
    const bc = style.borderColor;
    const bgC = style.backgroundColor;
    const basePx = 16.32;
    const fs = basePx * (style.fontSize / 32);

    let stl = {
      fontSize: fs + 'px',
      color: tx.active ? `rgba(${tx.r}, ${tx.g}, ${tx.b}, ${tx.a})` : 'rgba(220, 220, 220, 1)',
      borderColor: bc.active ? `rgba(${bc.r}, ${bc.g}, ${bc.b}, ${bc.a})` : 'transparent',
      backgroundColor: bgC.active ? `rgba(${bgC.r}, ${bgC.g}, ${bgC.b}, ${bgC.a})` : 'rgba(0,0,0, 0.7)',
    };
    this.previewStyle.set(stl);
  }

  OnSettingsClose() {
    this.isInEditMode.set(false);
  }

  protected GetPreviewStyle() {
    const style = this.rule().style; 
    if (typeof style === 'string') {
      return {};
    }
    const tx = style.textColor;
    const bc = style.borderColor;
    const bgC = style.backgroundColor;
    const basePx = 16.32;
    const fs = basePx * (style.fontSize / 32);

    let stl = {
      fontSize: fs + 'px',
      color: tx.active ? `rgba(${tx.r}, ${tx.g}, ${tx.b}, ${tx.a})` : 'rgba(220, 220, 220, 1)',
      borderColor: bc.active ? `rgba(${bc.r}, ${bc.g}, ${bc.b}, ${bc.a})` : 'transparent',
      backgroundColor: bgC.active ? `rgba(${bgC.r}, ${bgC.g}, ${bgC.b}, ${bgC.a})` : 'rgba(0,0,0, 0.7)',
    };
    return stl;
  }
}
