import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { AppComponent } from "../app.component";
import { v4 } from 'uuid'


type FilterGame = "PoE1" | "PoE2"
export type Color = {
  active: boolean,
  r: number,
  g: number,
  b: number,
  a: number,
}

export type ColorRGBA = {
  r: number,
  g: number,
  b: number,
  a: number,
}

export type ColorRGB = {
  r: number,
  g: number,
  b: number,
}

export type ColorHSVA = {
  h: number,
  s: number,
  v: number,
  a: number,
}

export type ColorHSV = {
  h: number,
  s: number,
  v: number,
}

export type FilterData = {
  id: string,
  name: string,
  modified_at: Date,
  game: FilterGame
}

export type IconSize = 0 | 1 | 2;
export type IconColor = "Red" | "Green" | "Blue" | "Brown" | "White" | "Yellow" | "Cyan" | "Grey" | "Orange" | "Pink" | "Purple";
export type IconShape = "Circle" | "Diamond" | "Hexagon" | "Square" | "Star" | "Triangle" | "Cross" | "Moon" 
| "Raindrop" | "Kite" | "Pentagon" | "UpsideDownHouse"

type DropSoundInfo = {
  file: string,
  name: string
}

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

export type DropIcon = {
  active: boolean,
  size: IconSize,
  color: IconColor,
  shape: IconShape
}

export type DropSound = {
  active: boolean,
  sound: number,
  volume: number
  positional: boolean
}

export type DropPlayEffect = {
  active: boolean,
  color: IconColor,
  temp: boolean,
}

type RuleStyle = {
  id?: string,
  textColor: Color,
  borderColor: Color,
  backgroundColor: Color,
  dropSound: DropSound,
  dropIcon: DropIcon,
  dropPlayEffect: DropPlayEffect
}

type FilterRuleState = "Show"|"Hide"|"Disabled";

type FilterRule = {
  id: string,
  name: string,
  state: FilterRuleState,
  style: RuleStyle|string,
  items: string[],
  imgSrc: string,
}

type FilterBlock = {
  id: string,
  name: string,
  imgSrc: string,
  allowedCategories: string[],
  rules: FilterRule[];
}

type FilterSection = {
  id: string,
  name: string,
  blocks: FilterBlock[],
}

export type Filter = {
  id: string,
  user: string|null,
  name: string,
  created_at: Date,
  modified_at: Date,
  game: FilterGame
  sections: FilterSection[]
}

export type FilterRuleInfo = {
  id: string,
  name: string,
  state: FilterRuleState,
  style: RuleStyle,
  imgSrc: string,
  items: string[],
  position: number,
}

export type FilterBlockInfo = {
  id: string,
  position: number,
  name: string,
  imgSrc: string,
  allowedCategories: string[],
  rules: FilterRuleInfo[]
}

export type FilterSectionInfo = {
  id: string,
  name: string,
  blocks: FilterBlockInfo[],
  position: number
}


export type FilterInfo = {
  id: string,
  user: string|null,
  name: string,
  created_at: Date,
  modified_at: Date,
  game: FilterGame,
  sections: FilterSectionInfo[],
}

@Injectable()
export class FilterService {
  private filter = signal<FilterInfo|null>(null)
  private backend = AppComponent.Backend() + 'filter/';
  private readonly defaultRuleStyle: RuleStyle = {
    textColor: {active: true, r: 170, g: 158, b: 129, a: 1},
    borderColor: {active: false, r: 250, g: 250, b: 250, a: 1},
    backgroundColor: {active: true, r: 0, g: 0, b: 0, a: 0.7},
    dropSound: {active: false, sound: 1, volume: 300, positional: false },
    dropIcon: {active: false, size: 0, shape: 'Circle', color: 'Blue'},
    dropPlayEffect: {active: false, color: 'Blue', temp: false}
  }

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
            filters[i].modified_at = new Date(filters[i].modified_at)
          }
          resolve(filters);
        }),
        error: err => {
          console.error(err);
          resolve(err);
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
      console.log("Saving", filter);
      if (filter === null) {
        resolve();
      }
      this.http.patch(this.backend, filter, {withCredentials: true}).subscribe({
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
          name: "New Block",
          imgSrc: "",
          position: section.blocks.length,
          allowedCategories: [],
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

  CreateRule(blockId: string) {
    const filter = this.filter();
    if (filter === null) {
      return;
    }
    let block: FilterBlockInfo|null = null;
    for (let i = 0; i < filter.sections.length; i++) {
      const section = filter.sections[i];
      for (let j = 0; i < section.blocks.length; j++) {
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
    const rule: FilterRuleInfo = {
      id: v4(),
      name: "Unamed Rule",
      imgSrc: "",
      state: "Disabled",
      style: this.GetDefaultRuleStyle(),
      items: [],
      position: block.rules.length
    }
    block.rules.push(rule);
  }

  DeleteRule(id: string) {
    const filter = this.filter();
    if (filter === null) {
      return;
    }
    for (let i = 0; i < filter.sections.length; i++) {
      for (let j = 0; j < filter.sections[i].blocks.length; j++) {
        for (let k = 0; k < filter.sections[i].blocks[j].rules.length; k++) {
          if (filter.sections[i].blocks[j].rules[k].id === id) {
            filter.sections[i].blocks[j].rules.splice(k, 1);
            return;
          }
        }
      }
    }
  }

  private GetRuleStyle(id: string) {
    const style: RuleStyle = {
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
      created_at: filter.created_at,
      modified_at: filter.modified_at,
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
        const block: FilterBlockInfo = {
          id: b.id,
          name: b.name,
          imgSrc: b.imgSrc,
          position: j,
          allowedCategories: [...b.allowedCategories],
          rules: []
        };
        for (let k = 0; k < b.rules.length; k++) {
          const r = b.rules[k];
          const ruleStyle = (typeof r.style === 'string') ? this.GetRuleStyle(r.style) : r.style;
          const rule: FilterRuleInfo = {
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
        section.blocks.push(block);
      }
      filterInfo.sections.push(section);
    }
    console.log("Got", filterInfo);
    return filterInfo;
  }
}