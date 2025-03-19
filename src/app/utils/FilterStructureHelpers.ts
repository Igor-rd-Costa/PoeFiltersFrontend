import { v4 } from "uuid";
import { FilterBlockStructure, FilterRuleBlockStructure, FilterRuleStructure, FilterSectionStructure } from "../types/FilterStructureTypes";
import { FilterRuleItemType, FilterRuleType } from "../types/FilterTypes";


export class FilterStructureHelpers
{
  private constructor() {}
  
  public static CreateSection(position: number): FilterSectionStructure {
    return {
      id: v4(),
      name: "Unnamed Structure",
      blocks: [],
      position
    };
  }

  public static CreateBlock(allowUserCreatedRules: boolean, position: number): FilterBlockStructure {
    return {
      id: v4(),
      name: "Unnamed Block",
      imgSrc: "",
      allowedCategories: [],
      rulesType: FilterRuleType.RULE_FULL,
      rules: [],
      allowUserCreatedRules,
      position
    };
  }

  public static CreateRuleBlock(rulesType: FilterRuleType, position: number): FilterRuleBlockStructure {
    return {
      id: v4(),
      type: FilterRuleItemType.RULE_BLOCK,
      name: "Unnamed RuleBlock",
      allowedCategories: null,
      allowUserCreatedRules: false,
      rulesType,
      rules: [],
      position
    };
  }

  public static CreateRule(position: number): FilterRuleStructure {
    return {
      id: v4(),
      type: FilterRuleItemType.RULE,
      name: "Unnamed Rule",
      imgSrc: "",
      position
    };
  }
}