export function throttle(fn, delay) {
  let timer;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, arguments);
      }, delay);
    }
  };
}
