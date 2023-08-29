// Add _compile to Module
declare namespace NodeJS {
  interface Module {
    _compile(content: string, filename: string): any;
  }
}
