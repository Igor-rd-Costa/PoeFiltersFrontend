import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { AppComponent } from "../app.component";
import { v4 } from 'uuid'
import { DropSoundInfo, Filter, FilterBlock, FilterBlockInfo, FilterBlockRulesType, FilterInfo, FilterRule, 
  FilterRuleBlock, FilterRuleBlockInfo, FilterRuleInfo, FilterRuleItemType, FilterSection, FilterSectionInfo, IconColor, 
  IconShape, IconSize, RuleStyle } from "../types/FilterTypes";
import { IPositionableSortFn } from "../utils/helpers";

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
  private filter = signal<FilterInfo|null>(null)
  private backend = AppComponent.Backend() + 'filter/';
  private readonly defaultRuleStyle: RuleStyle = {
    fontSize: 32,
    textColor: {active: true, r: 170, g: 158, b: 129, a: 1},
    borderColor: {active: false, r: 250, g: 250, b: 250, a: 1},
    backgroundColor: {active: true, r: 0, g: 0, b: 0, a: 0.7},
    dropSound: {active: false, sound: 1, volume: 300, positional: false },
    dropIcon: {active: false, size: 0, shape: 'Circle', color: 'Blue'},
    dropPlayEffect: {active: false, color: 'Blue', temp: false}
  }
  private dragTarget: FilterBlockInfo|FilterRuleBlockInfo|FilterRuleInfo|null = null;

  constructor(private http: HttpClient) {}

  Filter() {
    let filter = this.filter();
    if (filter === null) {
      const f = sessionStorage.getItem("filter");
      filter = f === null ? null : (JSON.parse(f) as FilterInfo)
      this.filter.set(filter);
    }
    return filter;
  }

  GetDefaultRuleStyle(): RuleStyle {
    return {
      fontSize: this.defaultRuleStyle.fontSize,
      textColor: {...this.defaultRuleStyle.textColor},
      borderColor: {...this.defaultRuleStyle.borderColor},
      backgroundColor: {...this.defaultRuleStyle.backgroundColor},
      dropIcon: {...this.defaultRuleStyle.dropIcon},
      dropSound: {...this.defaultRuleStyle.dropSound},
      dropPlayEffect: {...this.defaultRuleStyle.dropPlayEffect}
    };
  }

  LoadFilter(id: string) {
    return new Promise<boolean>(resolve => {
      this.http.get<Filter|null>(this.backend + id + "/", {withCredentials: true}).subscribe({
        next: filter => {
          if (filter === null) {
            sessionStorage.removeItem("filter");
            this.filter.set(null);
            resolve(false);
            return;
          }
          const filterInfo = this.FilterToFilterInfo(filter);
          sessionStorage.setItem("filter", JSON.stringify(filterInfo));
          this.filter.set(filterInfo);
          resolve(true);
        },
        error: err => {
          this.filter.set(null);
          console.error(err);
          resolve(false);
        }
      });
    });
  }

  GetFiltersInfo() {
    return new Promise<FilterInfo[]>(resolve => {
      this.http.get<FilterInfo[]>(this.backend, {withCredentials: true}).subscribe({
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

  CreateFilter(name: string) {
    return new Promise<boolean>(resolve => {
      this.http.post<Filter|null>(this.backend, {name: name}, {withCredentials: true}).subscribe({
        next: filter => {
          if (filter === null) {
            resolve(false);
            return;
          }
          const filterInfo = this.FilterToFilterInfo(filter);
          this.filter.set(filterInfo);
          resolve(true);
        },
        error: err => {
          console.error(err);
          this.filter.set(null);
          resolve(false);
        }
      })
    })
  }

  DeleteFilter(id: string) {
    return new Promise<boolean>(resolve => {
      this.http.delete(this.backend, {body: {id: id}, withCredentials: true}).subscribe({
        next: _ => {
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
      this.http.patch(this.backend, this.FilterInfoToFilter(filter), {withCredentials: true}).subscribe({
        next: _ => {
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
      this.http.get<string>(this.backend+'generate/'+filter.id, {withCredentials: true, responseType: 'text' as 'json'}).subscribe({
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

  CreateSection() {
    const filter = this.filter();
    if (filter === null) {
      return;
    }
    const s: FilterSectionInfo = {
      id: v4(),
      name: "New Section",
      position: filter.sections.length,
      blocks: []
    }
    filter.sections.push(s);
  }

  DeleteSection(id: string) {
    const filter = this.filter();
    if (filter === null) {
      return;
    }
    for (let i = 0; i < filter.sections.length; i++) {
      if (filter.sections[i].id === id) {
        filter.sections.splice(i, 1);
        return;
      }
    }
  }

  CreateBlock(sectionId: string) {
    const filter = this.filter();
    if (filter === null) {
      return;
    }
    for (let i = 0; i < filter.sections.length; i++) {
      const section = filter.sections[i];
      if (section.id === sectionId) {
        const block: FilterBlockInfo = {
          id: v4(),
          name: "Unnamed Block",
          imgSrc: "",
          position: section.blocks.length,
          allowedCategories: [],
          rulesType: FilterBlockRulesType.RULE_FULL,
          rules: []
        };
        section.blocks.push(block);
        return;
      }
    }
  }

  DeleteBlock(id: string) {
    const filter = this.filter();
    if (filter === null) {
      return;
    }
    for (let i = 0; i < filter.sections.length; i++) {
      for (let j = 0; j < filter.sections[i].blocks.length; j++) {
        if (filter.sections[i].blocks[j].id === id) {
          filter.sections[i].blocks.splice(j, 1);
          return;
        }
      }
    }
  }

  CreateRule(blockId: string, ruleBlockId?: string) {
    const filter = this.filter();
    if (filter === null) {
      return;
    }
    let target: FilterBlockInfo|FilterRuleBlockInfo|null = null;
    for (let i = 0; i < filter.sections.length; i++) {
      const section = filter.sections[i];
      for (let j = 0; j < section.blocks.length; j++) {
        if (section.blocks[j].id === blockId) {
          if (ruleBlockId === undefined) {
            target = section.blocks[j];
          } else {
            for (let k = 0; k < section.blocks[j].rules.length; k++) {
              const r = section.blocks[j].rules[k];
              if (r.type === FilterRuleItemType.RULE_BLOCK && r.id === ruleBlockId) {
                target = r as FilterRuleBlockInfo;
                break;
              }
            }
          }
          break;
        }
      }
      if (target !== null) {
        break;
      }
    }
    if (target === null) {
      return;
    }
    const rule: FilterRuleInfo = {
      type: FilterRuleItemType.RULE,
      id: v4(),
      name: "Unnamed Rule",
      imgSrc: "",
      state: "Disabled",
      style: this.GetDefaultRuleStyle(),
      items: [],
      position: target.rules.length
    }
    target.rules.push(rule);
  }

  CreateRuleBlock(blockId: string) {
    const filter = this.filter();
    if (filter === null) {
      return;
    }
    let block: FilterBlockInfo|null = null;
    for (let i = 0; i < filter.sections.length; i++) {
      const section = filter.sections[i];
      for (let j = 0; j < section.blocks.length; j++) {
        if (section.blocks[j].id === blockId) {
          block = section.blocks[j];
          break;
        }
      }
      if (block !== null) {
        break;
      }
    }
    if (block === null) {
      return;
    }
    const ruleBlock: FilterRuleBlockInfo = {
      type: FilterRuleItemType.RULE_BLOCK,
      id: v4(),
      name: "Unnamed RuleBlock",
      allowUserCreatedRules: false,
      rules: [],
      position: block.rules.length
    }
    block.rules.push(ruleBlock);
  }

  DeleteRule(id: string) {
    const filter = this.filter();
    if (filter === null) {
      return;
    }
    for (let i = 0; i < filter.sections.length; i++) {
      for (let j = 0; j < filter.sections[i].blocks.length; j++) {
        for (let k = 0; k < filter.sections[i].blocks[j].rules.length; k++) {
          const r = filter.sections[i].blocks[j].rules[k];
          if (r.id === id && r.type === FilterRuleItemType.RULE) {
            filter.sections[i].blocks[j].rules.splice(k, 1);
            return;
          }
        }
      }
    }
  }

  DeleteRuleBlock(id: string) {
    const filter = this.filter();
    if (filter === null) {
      return;
    }
    for (let i = 0; i < filter.sections.length; i++) {
      for (let j = 0; j < filter.sections[i].blocks.length; j++) {
        for (let k = 0; k < filter.sections[i].blocks[j].rules.length; k++) {
          const r = filter.sections[i].blocks[j].rules[k];
          if (r.id === id && r.type === FilterRuleItemType.RULE_BLOCK) {
            filter.sections[i].blocks[j].rules.splice(k, 1);
            return;
          }
        }
      }
    }
  }

  private GetRuleStyle(id: string) {
    //TODO Implement this
    const style: RuleStyle = {
      fontSize: 32,
      textColor: {active: true, r: 0, g: 0, b: 0, a: 255},
      borderColor: {active: true, r: 0, g: 0, b: 0, a: 255},
      backgroundColor: {active: true, r: 0, g: 0, b: 0, a: 255},
      dropSound: {active: true, sound: 0, volume: 300, positional: false },
      dropIcon: {active: false, size: 0, shape: 'Circle', color: 'Red'},
      dropPlayEffect: {active: false, color: 'Blue', temp: false }
    };
    return style;
  }


  private FilterToFilterInfo(filter: Filter): FilterInfo {
    const filterInfo: FilterInfo = {
      id: filter.id,
      user: filter.user,
      name: filter.name,
      game: filter.game,
      createdAt: filter.createdAt,
      modifiedAt: filter.modifiedAt,
      sections: []
    }
    for (let i = 0; i < filter.sections.length; i++) {
      const s = filter.sections[i];
      const section: FilterSectionInfo = {
        id: s.id,
        name: s.name,
        position: i,
        blocks: [],
      }
      for (let j = 0; j < s.blocks.length; j++) {
        const b = s.blocks[j];
        if (b.rulesType === undefined) {
          b.rulesType = FilterBlockRulesType.RULE_FULL;
        }
        const block: FilterBlockInfo = {
          id: b.id,
          name: b.name,
          imgSrc: b.imgSrc,
          position: j,
          allowedCategories: [...b.allowedCategories],
          rulesType: b.rulesType,
          rules: []
        };
        for (let k = 0; k < b.rules.length; k++) {
          if (b.rules[k].type !== FilterRuleItemType.RULE_BLOCK) {
            const r = b.rules[k] as FilterRuleInfo;
            const ruleStyle = (typeof r.style === 'string') ? this.GetRuleStyle(r.style) : r.style;
            if (!ruleStyle.fontSize) {
              ruleStyle.fontSize = 32;
            }
            const rule: FilterRuleInfo = {
              type: FilterRuleItemType.RULE,
              id: r.id,
              name: r.name,
              imgSrc: r.imgSrc,
              state: r.state,
              style: ruleStyle,
              items: [...r.items],
              position: k,
            }
            block.rules.push(rule);
          }
        }
        section.blocks.push(block);
        }
        filterInfo.sections.push(section);
    }
    return filterInfo;
  }

  private FilterInfoToFilter(filterInfo: FilterInfo): Filter {
    const filter: Filter = {
      id: filterInfo.id,
      user: filterInfo.user,
      name: filterInfo.name,
      createdAt: filterInfo.createdAt,
      modifiedAt: filterInfo.modifiedAt,
      game: filterInfo.game,
      sections: []
    };

    const sections = filterInfo.sections.sort(IPositionableSortFn);
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const section: FilterSection = {
        id: s.id,
        name: s.name,
        blocks: []
      }
      const blocks = s.blocks.sort(IPositionableSortFn);
      for (let j = 0; j < blocks.length; j++) {
        const b = blocks[j];
        const block: FilterBlock = {
          id: b.id,
          name: b.name,
          imgSrc: b.imgSrc,
          rulesType: b.rulesType,
          allowedCategories: b.allowedCategories,
          rules: []
        }
        const rules = b.rules.sort(IPositionableSortFn);
        for (let k = 0; k < rules.length; k++) {
          const r = rules[k];
          if (r.type === FilterRuleItemType.RULE_BLOCK) {
            const ruleBlock: FilterRuleBlock = {
              id: r.id,
              name: r.name,
              type: FilterRuleItemType.RULE_BLOCK,
              allowUserCreatedRules: (r as FilterRuleBlockInfo).allowUserCreatedRules,
              rules: []
            };
            const ruleBlockRules = (r as FilterRuleBlockInfo).rules.sort(IPositionableSortFn);
            for (let l = 0; l < ruleBlockRules.length; l++) {
              const ru = ruleBlockRules[l];
              const rule: FilterRule = {
                id: ru.id,
                name: ru.name,
                type: FilterRuleItemType.RULE,
                imgSrc: ru.imgSrc,
                state: ru.state,
                style: ru.style,
                items: ru.items,
              }
              ruleBlock.rules.push(rule);
            }
            block.rules.push(ruleBlock);
          } else {
            const rule: FilterRule = {
              id: r.id,
              name: r.name,
              type: FilterRuleItemType.RULE,
              imgSrc: (r as FilterRuleInfo).imgSrc,
              state: (r as FilterRuleInfo).state,
              style: (r as FilterRuleInfo).style,
              items: (r as FilterRuleInfo).items,
            }
            block.rules.push(rule);
          }
        }
        section.blocks.push(block);
      }
      filter.sections.push(section);
    }
    return filter;
  }

  IsDragDropInProgress() {
    return this.dragTarget !== null;
  }

  DragDrop(target: FilterBlockInfo|FilterRuleBlockInfo|FilterRuleInfo) {
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
      if ((target as FilterRuleInfo).type !== undefined) {
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
      if ((target as FilterRuleInfo).type !== undefined) {
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
    let srcSection: FilterSectionInfo|null = null;
    let trgSection: FilterSectionInfo|null = null;
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
    let trgBlock: FilterBlockInfo|FilterRuleBlockInfo|null = null;
    let trgRule: FilterRuleInfo|FilterRuleBlockInfo|null = null;
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
                trgBlock = r as FilterRuleBlockInfo;
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
}