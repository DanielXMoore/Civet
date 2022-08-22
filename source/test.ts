/**
 * Hidouo
 */
function x() {
  return "yo"
}

interface User {
  name: {
    first: string;
    last: string;
  };
  id: number;
};

interface X<A, B, C,, > {
  x: A
  y: B
  z: C
}
