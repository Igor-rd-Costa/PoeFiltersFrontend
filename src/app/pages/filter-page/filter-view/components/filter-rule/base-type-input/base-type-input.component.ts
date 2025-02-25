import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { ItemService, Item, ItemCategory } from '../../../../../../services/ItemService';
import { ItemCategoryService } from '../../../../../../services/ItemCategoryService';

const itemsMap = new Map<string, Item[]>();
const itemCategories: ItemCategory[] = [];

@Component({
  selector: 'app-base-type-input',
  standalone: true,
  imports: [],
  templateUrl: './base-type-input.component.html',
})
export class BaseTypeInputComponent implements AfterViewInit {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @Input() suggestFromCategories: string[] = [];
  @Output() basetypeSelect = new EventEmitter<Item>();
  protected showSuggestionBox = signal<boolean>(false);
  protected isInAddMode = signal<boolean>(false);
  protected categories: ItemCategory[] = [];
  protected suggestedBaseTypes: Item[] = [];

  constructor(private itemService: ItemService, private itemCategoryService: ItemCategoryService) {}

  async ngAfterViewInit() {
    if (itemCategories.length === 0) {
      itemCategories.push(...await this.itemCategoryService.GetBaseItemCategories());
      for (let i = 0; i < itemCategories.length; i++) {
        itemsMap.set(itemCategories[i].id, []);
      }
    }
    for (let i = 0; i < this.suggestFromCategories.length; i++) {
      for (let j = 0; j < itemCategories.length; j++) {
        if (this.suggestFromCategories[i] === itemCategories[j].id) {
          this.categories.push({...itemCategories[j]});
          break;
        }
      }
    }
  }
  
  protected AddMode() {
    this.isInAddMode.set(true);
  }

  protected Cancel() {
    this.isInAddMode.set(false);
  }

  SelectBaseType(item: Item) {
    this.basetypeSelect.emit(item);
    this.showSuggestionBox.set(false);
    this.isInAddMode.set(false);
    this.suggestedBaseTypes = [];
  }

  protected async OnInput(event: Event) {
    const e = event as InputEvent;
    const val = this.input.nativeElement.value.trim().toLowerCase();
    if (val === "") {
      this.showSuggestionBox.set(false);
      this.suggestedBaseTypes = [];
      return;
    }
    this.showSuggestionBox.set(true);
    switch(e.inputType) {
      case "insertText": {
        if (val === e.data?.toLowerCase()) {
          for (let i = 0; i < this.categories.length; i++) {
            this.suggestedBaseTypes.push(...await this.itemService.GetItemsFromCategory(this.categories[i].id)); 
            console.log("C", this.suggestedBaseTypes);
          }
          break;
        }
        for (let i = 0; i < this.suggestedBaseTypes.length; i++) {
          if (!this.suggestedBaseTypes[i].name.toLowerCase().includes(val)) {
            this.suggestedBaseTypes.splice(i, 1);
            i--;
            continue;
          }
        }
      } break;
      case "deleteContentForward":
      case "deleteContentBackward": {
        //TODO: not re-fetch bases?
        this.suggestedBaseTypes = [];
        for (let i = 0; i < this.categories.length; i++) {
          this.suggestedBaseTypes.push(...(await this.itemService.GetItemsFromCategory(this.categories[i].id))
          .filter(item => item.name.toLowerCase().includes(val))); 
        }
      } break;
      default: console.warn("BaseTypeInput: OnInput() -> Unhandled inputType " + e.inputType);
    }
  }
}
