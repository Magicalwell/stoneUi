export interface HTMLElementScroll extends HTMLElement {
  [key: string]: any;
}
export function addEventListener(
  ele: HTMLElementScroll,
  eventType: string,
  callback: any
) {
  if (ele.addEventListener) {
    return ele.addEventListener(eventType, callback, false);
  } else if (ele["attachEvent" as keyof HTMLElement]) {
    return ele["attachEvent"](eventType, callback);
  } else {
    return (ele["on" + eventType] = callback);
  }
}
