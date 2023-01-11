export const b64 = {
  encode(str: string) {
    if (typeof window === 'undefined') {
      return Buffer.from(str).toString('base64');
    }
    return window.btoa(str);
  },
  decode(str: string) {
    if (typeof window === 'undefined') {
      return Buffer.from(str, 'base64').toString();
    }
    return window.atob(str);
  },
};
