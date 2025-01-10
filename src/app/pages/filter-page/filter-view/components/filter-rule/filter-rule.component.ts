import { AfterViewInit, Component, effect, ElementRef, Input, model, ModelSignal, OnChanges, signal, SimpleChanges, ViewChild } from '@angular/core';
import { GetHTMLContentHeight } from '../../../../../utils/helpers';
import { Color, ColorRGBA, FilterRuleInfo, FilterService } from '../../../../../services/FilterService';
import { ColorInputComponent } from './color-input/color-input.component';
import { IconInputComponent } from "./icon-input/icon-input.component";
import { SoundInputComponent } from "./sound-input/sound-input.component";
import { PlayEffectInputComponent } from "./play-effect-input/play-effect-input.component";
import { ItemService, Item, ItemCategory } from '../../../../../services/ItemService';
import { BaseTypeInputComponent } from './base-type-input/base-type-input.component';
import { FontSizeInputComponent } from "./font-size-input/font-size-input.component";

@Component({
  selector: 'app-filter-rule',
  standalone: true,
  imports: [ColorInputComponent, IconInputComponent, SoundInputComponent, PlayEffectInputComponent, BaseTypeInputComponent, FontSizeInputComponent],
  templateUrl: './filter-rule.component.html',
})
export class FilterRuleComponent implements AfterViewInit {
  @ViewChild("wrapper") wrapper!: ElementRef<HTMLElement>;
  @Input() itemCategories: string[] = [];
  rule = model.required<FilterRuleInfo>();
  isExpanded = signal<boolean>(false);
  isInEditMode = signal<boolean>(false);
  items: Item[] = [];
  categories: ItemCategory[] = [];

  constructor(private itemService: ItemService, private filterService: FilterService) {
    effect(() => {
      if (this.isInEditMode()) {
        //this.GetBaseTypeCategories();
      }
    })
  }

  async ngAfterViewInit() {
    if (this.rule().items.length === 0) {
      this.rule().state = "Disabled";
    }
    if (this.rule().items.length > 0) {
      this.items = await this.itemService.GetItemsById(this.rule().items);
    }
  }

  OnTextColorInputChange(value: ColorRGBA) {
    const c = {...this.rule().style.textColor};
    c.r = value.r;
    c.g = value.g;
    c.b = value.b;
    c.a = value.a;
    this.rule().style.textColor = c;
  }

  OnBorderColorInputChange(value: ColorRGBA) {
    const c = {...this.rule().style.borderColor};
    c.r = value.r;
    c.g = value.g;
    c.b = value.b;
    c.a = value.a;
    this.rule().style.borderColor = c;
  }

  OnBackgroundColorInputChange(value: ColorRGBA) {
    const c = {...this.rule().style.backgroundColor};
    c.r = value.r;
    c.g = value.g;
    c.b = value.b;
    c.a = value.a;
    this.rule().style.backgroundColor = c;
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
    //this.GetBaseTypeCategories();
    this.isInEditMode.set(true);  
  }

  // ToggleIncludedCategories(category: ItemCategory) {
  //   if (!this.rule().allowedCategories) {
  //     return;
  //   }
  //   for (let i = 0; i < this.rule().allowedCategories!.length; i++) {
  //     if (this.rule().allowedCategories![i] === category.id) {
  //       this.rule().allowedCategories!.splice(i, 1);
  //       return;
  //     }
  //   }
  //   this.rule().allowedCategories!.push(category.id);
  // }

  // IsCategoryIncluded(category: ItemCategory) {
  //   if (!this.rule().allowedCategories) {
  //     return;
  //   }
  //   for (let i = 0; i < this.rule().allowedCategories!.length; i++) {
  //     if (this.rule().allowedCategories![i] === category.id) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  CancelEdit(event: MouseEvent) {
    event.stopPropagation();
    this.isInEditMode.set(false);
  }

  SaveBlockInfo(event: SubmitEvent) {
    event.preventDefault();
    const form = this.wrapper.nativeElement.querySelector("#filter-rule-wrapper-edit-form") as HTMLElement|null;
    if (!form) {
      return;
    }
    const nameInput = form.querySelector("#filter-rule-wrapper-edit-form-name-input") as HTMLInputElement|null;
    const imgInput = form.querySelector("#filter-rule-wrapper-edit-form-img-input") as HTMLInputElement|null;

    const nameValue = nameInput?.value ?? this.rule().name;
    const imgValue = imgInput?.value ?? this.rule().imgSrc;

    this.rule().name = nameValue;
    this.rule().imgSrc = imgValue;
    this.isInEditMode.set(false);
  }

  AddBaseType(item: Item) {
    for (let i = 0; i < this.rule().items.length; i++) {
      if (this.rule().items[i] === item.id) {
        return;
      }
    }
    this.rule().items.push(item.id);
    this.items.push(item);
    if (this.rule().state === "Disabled") {
      this.rule().state = "Show";
    }
    console.log("D", this.rule().items);
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
  
  // async GetBaseTypeCategories() {
  //   if (this.rule().allowedCategories && this.rule().allowedCategories!.length > 0) {
  //     this.categories = await this.adminService.GetItemCategories();
  //   }
  // }

  protected GetStateButtomColor() {
    switch(this.rule().state) {
      case "Hide":
      case "Show": return "#B07FFFFF";
      case "Disabled": return "#703FACFF";
    }
  }

  OnFontSizeChange(fontSize: number) {
    this.rule().style.fontSize = fontSize;
  }

  protected ResetStyles() {
    this.rule().style = this.filterService.GetDefaultRuleStyle();
  }

  protected Delete() {
    this.filterService.DeleteRule(this.rule().id);
  }

  protected OnDragStart() {
    this.filterService.DragDrop(this.rule());
  }

  protected GetPreviewStyle() {
    const tx = this.rule().style.textColor;
    const bc = this.rule().style.borderColor;
    const bgC = this.rule().style.backgroundColor;
    const basePx = 16.32;
    const fs = basePx * (this.rule().style.fontSize / 32);

    let stl = {
      fontSize: fs + 'px',
      color: tx.active ? `rgba(${tx.r}, ${tx.g}, ${tx.b}, ${tx.a})` : 'rgba(220, 220, 220, 1)',
      borderColor: bc.active ? `rgba(${bc.r}, ${bc.g}, ${bc.b}, ${bc.a})` : 'transparent',
      backgroundColor: bgC.active ? `rgba(${bgC.r}, ${bgC.g}, ${bgC.b}, ${bgC.a})` : 'rgba(0,0,0, 0.7)',
    };
    return stl;
  }
}
