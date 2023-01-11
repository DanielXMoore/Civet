export function debounce<T extends (...args: any) => any>(
  func: T,
  timeout = 300
) {
  let timer: NodeJS.Timer;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
