export type FilterGame = "PoE1" | "PoE2"

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

export type IconSize = 0 | 1 | 2;
export type IconColor = "Red" | "Green" | "Blue" | "Brown" | "White" | "Yellow" | "Cyan" | "Grey" | "Orange" | "Pink" | "Purple";
export type IconShape = "Circle" | "Diamond" | "Hexagon" | "Square" | "Star" | "Triangle" | "Cross" | "Moon" 
| "Raindrop" | "Kite" | "Pentagon" | "UpsideDownHouse"

export type DropSoundInfo = {
  file: string,
  name: string
}

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

export type RuleStyle = {
  id?: string,
  fontSize: number,
  textColor: Color,
  borderColor: Color,
  backgroundColor: Color,
  dropSound: DropSound,
  dropIcon: DropIcon,
  dropPlayEffect: DropPlayEffect
}

export type FilterRuleState = "Show"|"Hide"|"Disabled";

export enum FilterRuleItemType {
  RULE, RULE_BLOCK
}

export enum FilterRuleType {
  RULE_MINIMAL, RULE_FULL
}

export interface IPositionable {
  position: number
}

export type FilterData = {
  id: string,
  name: string,
  modifiedAt: Date,
  game: FilterGame
}

interface FilterBase {
  id: string,
  user: string|null,
  name: string,
  createdAt: Date,
  modifiedAt: Date,
  game: FilterGame,
}

interface FilterSectionBase {
  id: string,
  name: string,
}

interface FilterBlockBase {
  id: string,
  name: string,
  imgSrc: string,
  allowedCategories: string[],
  rulesType: FilterRuleType,
}

interface FilterRuleBlockBase {
  id: string,
  name: string,
  type: FilterRuleItemType,
  allowUserCreatedRules: boolean,
  rulesType: FilterRuleType
}

interface FilterRuleBase {
  id: string,
  type: FilterRuleItemType,
  name: string,
  state: FilterRuleState,
  style: RuleStyle|string,
  imgSrc: string,
  items: string[],
}


export type Filter = FilterBase & {
  sections: FilterSection[]
}

export type FilterSection = FilterSectionBase & {
  blocks: FilterBlock[],
}

export type FilterBlock = FilterBlockBase & {
  rules: (FilterRule|FilterRuleBlock)[];
}

export type FilterRuleBlock = FilterRuleBlockBase & {
  rules: FilterRule[],
}

export type FilterRule = FilterRuleBase;



export type FilterInfo = FilterBase & {
  sections: FilterSectionInfo[],
}

export type FilterSectionInfo = IPositionable & FilterSectionBase & { 
  blocks: FilterBlockInfo[],
}

export type FilterBlockInfo = IPositionable & FilterBlockBase & {
  rules: (FilterRuleInfo|FilterRuleBlockInfo)[]
}

export type FilterRuleBlockInfo = IPositionable & FilterRuleBlockBase & {
  rules: FilterRuleInfo[],
}

export type FilterRuleInfo = IPositionable & FilterRuleBase;