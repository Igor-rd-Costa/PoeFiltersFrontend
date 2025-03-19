import { FilterRuleItemType, FilterRuleType } from "./FilterTypes";

export interface IPositionable {
  position: number
}

export type FilterBase = {
  id: string,
}

export type FilterSectionBase = IPositionable & {
  id: string,
  name: string,
}

export type FilterBlockBase = IPositionable & {
  id: string,
  name: string,
  imgSrc: string,
  allowedCategories: string[],
  allowUserCreatedRules: boolean,
  rulesType: FilterRuleType,
}

export type FilterRuleBlockBase = IPositionable & {
  id: string,
  name: string,
  type: FilterRuleItemType,
  allowedCategories: string[]|null,
  allowUserCreatedRules: boolean,
  rulesType: FilterRuleType
}

export type FilterRuleBase = IPositionable & {
  id: string,
  type: FilterRuleItemType,
  name: string,
  imgSrc: string,
}