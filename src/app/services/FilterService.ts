import { HttpClient } from "@angular/common/http";
import { computed, Injectable, signal } from "@angular/core";
import { AppComponent } from "../app.component";
import { DropSoundInfo, Filter, FilterBlock, FilterRule, FilterRuleBlock, FilterRuleItemType, FilterSection, FilterStrictness, IconColor, IconShape, IconSize, RuleStyle } from "../types/FilterTypes";
import { IPositionableSortFn } from "../utils/Helpers";

export const iconSizes: IconSize[] = [
  0, 1, 2
]
export const iconShapes: IconShape[] = [
  "Circle", "Diamond", "Hexagon", "Square", "Star", "Triangle", "Cross", "Moon", "Raindrop", "Kite", "Pentagon", "UpsideDownHouse"
]
export const iconColors: IconColor[] = [
  "Blue", "Green", "Brown", "Red", "White", "Yellow", "Cyan", "Grey", "Orange", "Pink", "Purple"
]

export const dropSounds: DropSoundInfo[] = [
  {name: '1', file: 'AlertSound1'},
  {name: '2', file: 'AlertSound2'},
  {name: '3', file: 'AlertSound3'},
  {name: '4', file: 'AlertSound4'},
  {name: '5', file: 'AlertSound5'},
  {name: '6', file: 'AlertSound6'},
  {name: '7', file: 'AlertSound7'},
  {name: '8', file: 'AlertSound8'},
  {name: '9', file: 'AlertSound9'},
  {name: '10', file: 'AlertSound10'},
  {name: '11', file: 'AlertSound11'},
  {name: '12', file: 'AlertSound12'},
  {name: '13', file: 'AlertSound13'},
  {name: '14', file: 'AlertSound14'},
  {name: '15', file: 'AlertSound15'},
  {name: '16', file: 'AlertSound16'},
  {name: '17(Orb of Alchemy)', file: 'AlertSoundShAlchemy'},
  {name: '18(Blessed Orb)', file: 'AlertSoundShBlessed'},
  {name: '19(Chaos Orb)', file: 'AlertSoundShChaos'},
  {name: '20(Divine Orb)', file: 'AlertSoundShDivine'},
  {name: '21(Exalted Orb)', file: 'AlertSoundShExalted'},
  {name: '22(Orb of Fusing)', file: 'AlertSoundShFusing'},
  {name: '23(General)', file: 'AlertSoundShGeneral'},
  {name: '24(Mirror of Kalandra)', file: 'AlertSoundShMirror'},
  {name: '25(Regal Orb)', file: 'AlertSoundShRegal'},
  {name: '25(Vaal Orb)', file: 'AlertSoundShVaal'},
]

@Injectable()
export class FilterService {
  private filter = signal<Filter|null>(null)
  private backend = computed(() => {
    return AppComponent.GameBackend() + 'filter/';
  });
  private dragTarget: FilterBlock|FilterRuleBlock|FilterRule|null = null;

  constructor(private http: HttpClient) {
    let filter = this.filter();
    if (filter === null) {
      const f = sessionStorage.getItem("filter");
      filter = f === null ? null : (JSON.parse(f) as Filter)
      this.filter.set(filter);
    }
  }

  Filter() {
    return this.filter();
  }

  LoadFilter(id: string) {
    return new Promise<boolean>(resolve => {
      this.http.get<Filter>(this.backend() + id + "/", {withCredentials: true}).subscribe({
        next: filter => {
          this.SetFilter(filter);
          resolve(true);
        },
        error: err => {
          this.UnsetFilter();
          console.error(err);
          resolve(false);
        }
      });
    });
  }

  GetFiltersInfo() {
    return new Promise<Filter[]>(resolve => {
      this.http.get<Filter[]>(this.backend(), {withCredentials: true}).subscribe({
        next: (filters => {
          for (let i = 0; i < filters.length; i++) {
            filters[i].createdAt = new Date(filters[i].createdAt);
            filters[i].modifiedAt = new Date(filters[i].modifiedAt);
          }
          resolve(filters);
        }),
        error: err => {
          console.error(err);
          resolve([]);
        }
      })
    });
  }

  CreateFilter(name: string, strictness: FilterStrictness) {
    return new Promise<boolean>(resolve => {
      this.http.post<Filter|null>(this.backend(), {name, strictness}, {withCredentials: true}).subscribe({
        next: filter => {
          if (filter === null) {
            resolve(false);
            return;
          }
          this.SetFilter(filter);
          resolve(true);
        },
        error: err => {
          console.error(err);
          this.UnsetFilter();
          resolve(false);
        }
      })
    })
  }

  DeleteFilter(id: string) {
    return new Promise<boolean>(resolve => {
      this.http.delete(this.backend(), {body: {id: id}, withCredentials: true}).subscribe({
        next: _ => {
          const f = this.filter();
          if (f !== null && f.id === id) {
            this.UnsetFilter();
          }
          resolve(true);
        },
        error: err => {
          console.error(err);
          resolve(false);
        }
      })
    });
  }

  Save() {
    return new Promise<void>(resolve => {
      const filter = this.filter();
      if (filter === null) {
        resolve();
        return;
      }
      this.http.patch(this.backend(), filter, {withCredentials: true}).subscribe({
        next: _ => {
          // Update session storage
          this.SetFilter(filter);
          resolve();
        },
        error: err => {
          console.error(err);
          resolve();
        }
      });
    });
  }

  Download() {
    return new Promise<void>(resolve => {
      const filter = this.filter();
      if (filter === null) {
        resolve();
        return;
      }
      this.http.get<string>(this.backend()+'generate/'+filter.id, {withCredentials: true, responseType: 'text' as 'json'}).subscribe({
        next: filterStr => {
          const blob = new Blob([filterStr], { type: 'text/plain' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filter.name+'.filter';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          resolve();
        },
        error: err => {
          console.error(err);
          resolve();
        }
      })
    });
  }

  IsDragDropInProgress() {
    return this.dragTarget !== null;
  }

  DragDrop(target: FilterBlock|FilterRuleBlock|FilterRule) {
    if (this.dragTarget !== null) {
      return;
    }
    this.dragTarget = target;
    const onDragEnd = (event: DragEvent) => {
      document.removeEventListener('drop', onDragEnd);
      if (!event.target || !this.dragTarget) {
        return;
      }
      const t = event.target as HTMLElement;
      if ((target as FilterRule).type !== undefined) {
        if (t.id !== "filter-rule-drag-target") {
          return;
        }
      } else if (t.id !== "filter-block-drag-target") {
        return;
      }
      t.classList.remove('active');
      const pos = t.attributes.getNamedItem('data-dragPosition')?.value;
      if (!pos) {
        console.error("Block/Rule drop target missing required position attribute");
        return;
      }
      if ((target as FilterRule).type !== undefined) {
        const blockId = t.attributes.getNamedItem('data-block')?.value;
        const ruleBlockId = t.attributes.getNamedItem('data-ruleBlock')?.value;
        if (!blockId) {
          console.error("Rule drop target missing required block attribute");
          return;
        }
        this.SetRulePosition(target.id, parseInt(pos), blockId, ruleBlockId);
      } else {
        const sectionId = t.attributes.getNamedItem('data-section')?.value;
        if (!sectionId) {
          console.error("Block drop target missing required section attribute");
          return;
        }
        this.SetBlockPosition(target.id, sectionId, parseInt(pos));
      }
      this.dragTarget = null;
    }
    document.addEventListener('drop', onDragEnd);
  }

  private SetBlockPosition(blockId: string, targetSectionId: string, position: number) {
    const sections = this.filter()?.sections;
    if (!sections) {
      return;
    }
    let srcSection: FilterSection|null = null;
    let trgSection: FilterSection|null = null;
    let currentPos = 0;
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      for (let j = 0; j < s.blocks.length; j++) {
        if (s.blocks[j].id === blockId) {
          srcSection = s;
          currentPos = j;
          break;
        }
      }
      if (s.id === targetSectionId) {
        trgSection = s;
      }
      if (srcSection && trgSection) {
        break;
      }
    }
    if (!srcSection || !trgSection) {
      return;
    }
    const sameSection = srcSection.id === trgSection.id;
    if (sameSection) {
      if (position === currentPos || position === currentPos + 1) { // Same position
        return;
      }
      if (position > currentPos) {
        for (let i = trgSection.blocks[currentPos].position + 1; i < position ; i++) {
          trgSection.blocks[i].position--;
        }
        position--;
      } else {
        for (let i = position; i < currentPos; i++) {
          trgSection.blocks[i].position++;
        }
      }
      trgSection.blocks[currentPos].position = position;
    } else {
      for (let i = currentPos + 1; i < srcSection.blocks.length; i++) {
        srcSection.blocks[i].position--;
      }
      const block = srcSection.blocks.splice(currentPos, 1)[0];
      block.position = position;
      if (position !== trgSection.blocks.length) {
        for (let i = position; i < trgSection.blocks.length; i++) {
          trgSection.blocks[i].position++;
        }
      }
      trgSection.blocks.push(block);
    }
    trgSection.blocks = trgSection.blocks.sort(IPositionableSortFn);
  }

  private SetRulePosition(ruleId: string, position: number, blockId: string, ruleBlockId?: string, ) {
    const sections = this.filter()?.sections;
    if (!sections) {
      return;
    }
    let trgBlock: FilterBlock|FilterRuleBlock|null = null;
    let trgRule: FilterRule|FilterRuleBlock|null = null;
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      for (let j = 0; j < s.blocks.length; j++) {
        const b = s.blocks[j];
        if (b.id === blockId) {
          if (ruleBlockId === undefined) {
            trgBlock = b;
          } else {
            for (let k = 0; k < b.rules.length; k++) {
              const r = b.rules[k];
              if (r.type === FilterRuleItemType.RULE_BLOCK && r.id === ruleBlockId) {
                trgBlock = r as FilterRuleBlock;
                break;
              }
            }  
          }
          if (trgBlock) {
            for (let k = 0; k < trgBlock.rules.length; k++) {
              const r = trgBlock.rules[k];
              if (r.id === ruleId) {
                trgRule = r;
                break;
              }
            }
          }
          break;
        }
      }
      if (trgBlock) {
        break;
      }
    }
    if (!trgBlock || !trgRule) {
      return;
    }
    if (position === trgRule.position || position === (trgRule.position + 1)) { // Same position
      return;
    }
    if (position > trgRule.position) {
      for (let i = trgRule.position + 1; i < position ; i++) {
        trgBlock.rules[i].position--;
      }
      position--;
    } else {
      for (let i = position; i < trgRule.position; i++) {
        trgBlock.rules[i].position++;
      }
    }
    trgRule.position = (position === trgBlock.rules.length) ? (trgBlock.rules.length - 1) : position;
    trgBlock.rules = trgBlock.rules.sort(IPositionableSortFn);
  }


  private SetFilter(filter: Filter) {
    this.filter.set(filter);
    sessionStorage.setItem("filter", JSON.stringify(filter));
  }

  private UnsetFilter() {
    this.filter.set(null);
    sessionStorage.removeItem("filter");
  }
}