

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