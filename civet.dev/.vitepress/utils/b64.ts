export const b64 = {
  encode(str: string) {
    const bytes = new TextEncoder().encode(str);
    str = String.fromCodePoint(...bytes);
    str = btoa(str);
    return str;
  },
  decode(str: string) {
    str = atob(str);
    const bytes = Uint8Array.from(str, (c) => c.codePointAt(0)!);
    str = new TextDecoder().decode(bytes);
    return str;
  },
};
