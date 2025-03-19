import { v4 } from "uuid";
import { FilterBlock, FilterRule, FilterRuleBlock, FilterRuleItemType, FilterRuleType, FilterSection, RuleStyle } from "../types/FilterTypes";

export default class FilterHelpers
{
  private constructor() {}

  public static CreateSection(position: number): FilterSection {
    return {
      id: v4(),
      name: "Unnamed Section",
      blocks: [],
      position
    };
  }

  public static CreateBlock(allowUserCreatedRules: boolean, position: number): FilterBlock {
    return {
      id: v4(),
      name: "Unnamed Block",
      imgSrc: "",
      rulesType: FilterRuleType.RULE_FULL,
      allowUserCreatedRules,
      allowedCategories: [],
      rules: [],
      position
    };
  }

  public static CreateRuleBlock(rulesType: FilterRuleType, position: number): FilterRuleBlock {
    return {
      id: v4(),
      name: "Unnamed RuleBlock",
      type: FilterRuleItemType.RULE_BLOCK,
      allowedCategories: null,
      allowUserCreatedRules: false,
      rulesType,
      rules: [],
      position
    };
  }
  
  public static CreateRule(position: number): FilterRule {
    return {
      id: v4(),
      name: "Unnamed Rule",
      imgSrc: '',
      type: FilterRuleItemType.RULE,
      state: 'Show',
      style:  this.DefaultRuleStyle(),
      items: [],
      position,
    }
  }

  public static DefaultRuleStyle(): RuleStyle {
    return {
      fontSize: 32,
      textColor: {active: true, r: 170, g: 158, b: 129, a: 1},
      borderColor: {active: false, r: 250, g: 250, b: 250, a: 1},
      backgroundColor: {active: true, r: 0, g: 0, b: 0, a: 0.7},
      dropSound: {active: false, sound: 1, volume: 300, positional: false },
      dropIcon: {active: false, size: 0, shape: 'Circle', color: 'Blue'},
      dropPlayEffect: {active: false, color: 'Blue', temp: false}
    }
  }
}