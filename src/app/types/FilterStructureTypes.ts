import { FilterGame, FilterRuleItemType } from "./FilterTypes"
import { FilterBase, FilterBlockBase, FilterRuleBase, FilterRuleBlockBase, FilterSectionBase } from "./FilterBaseTypes"


export type FilterStructure = FilterBase & {
  game: FilterGame,
  sections: FilterSectionStructure[]
}

export type FilterSectionStructure = FilterSectionBase & {
  blocks: FilterBlockStructure[];
}

export type FilterBlockStructure = FilterBlockBase & {
 rules: (FilterRuleBlockStructure|FilterRuleStructure)[]
}

export type FilterRuleBlockStructure = FilterRuleBlockBase & {
  rules: FilterRuleStructure[]
}

export type FilterRuleStructure = FilterRuleBase;