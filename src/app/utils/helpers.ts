import { ColorHSV, ColorRGB, FilterStrictness } from "../types/FilterTypes";
import { IPositionable } from "../types/FilterBaseTypes";

export function GetHTMLContentHeight(element: HTMLElement) {
  let height = 0;
  const style = getComputedStyle(element);
  height += parseFloat(style.paddingTop);
  height += parseFloat(style.paddingBottom);
  for (let i = 0; i < element.childElementCount; i++) {
    const child = element.children[i];
    if (getComputedStyle(child).position === "absolute") {
      continue;
    }
    const cStyle = getComputedStyle(child);
    height += parseFloat(cStyle.marginTop);
    height += parseFloat(cStyle.marginBottom);
    height += child.getBoundingClientRect().height;
  }
  return height;
}

export function RGBToHSV(color: ColorRGB): ColorHSV {
  const r = Math.max(Math.min(color.r / 255, 1), 0);
  const g = Math.max(Math.min(color.g / 255, 1), 0);
  const b = Math.max(Math.min(color.b / 255, 1), 0);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const c = max - min;

  let h = 0;

  if (c !== 0) {
    if (max === r) {
      h = ((g - b) / c) % 6;
    } else if (max === g) {
      h = (b - r) / c + 2;
    } else {
      h = (r - g) / c + 4;
    }
    h *= 60;
    if (h < 0) {
      h += 360;
    }
  }

  const s = max === 0 ? 0 : (c / max) * 100;
  const v = max * 100;

  return { h, s, v };
}

export function IPositionableSortFn(a: IPositionable, b: IPositionable) {
  if (a.position < b.position) {
    return -1;
  }
  return 1;
}

export function GetStrictnessString(strictness: FilterStrictness) {
  switch (strictness) {
    case FilterStrictness.REGULAR: return "Regular";
    case FilterStrictness.STRICT: return "Strict";  
    case FilterStrictness.MAX_VALUE: return "";
    default: {
      console.error("GetStrictnessString not implemented for FilterStrictness " + strictness);
      return "";
    }
  }
}