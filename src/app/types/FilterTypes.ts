import { FilterBase, FilterBlockBase, FilterRuleBase, FilterRuleBlockBase, FilterSectionBase } from "./FilterBaseTypes"

export enum FilterGame {
  POE1, POE2
}

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
  textColor: Color|null,
  borderColor: Color|null,
  backgroundColor: Color|null,
  dropSound: DropSound|null,
  dropIcon: DropIcon|null,
  dropPlayEffect: DropPlayEffect|null
}

export type FilterRuleState = "Show"|"Hide"|"Disabled";

export enum FilterRuleItemType {
  RULE,
  RULE_BLOCK,
}

export enum FilterRuleType {
  RULE_MINIMAL, 
  RULE_FULL
}

export enum FilterStrictness
{
    REGULAR, STRICT
}

export type FilterData = {
  id: string,
  name: string,
  modifiedAt: Date,
}


export type Filter = FilterBase & {
  user: string|null,
  name: string,
  createdAt: Date,
  modifiedAt: Date,
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

export type FilterRule = FilterRuleBase & {
  state: FilterRuleState,
  style: RuleStyle|string,
  items: string[],
};