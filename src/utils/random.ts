const CHARACTORS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';

const ri = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const rs = (length: number) => {
  let str = '';
  for (let i = 0; i < length; i++) {
    str += CHARACTORS.charAt(Math.random() * 62);
  }
  return str;
};

const re = <T>(...args: T[]) => {
  return args[ri(0, args.length - 1)];
};

export { ri, rs, re };
