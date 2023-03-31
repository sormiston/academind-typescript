// Function type referesher
// type AddFn = (a: number, b: number) => number;

// interface as Function Types
interface AddFn {
  (a: number, b: number): number;
}

let add: AddFn;
add = (n1: number, n2: number) => {
  return n1 + n2;
};

interface Named {
  readonly name: string;
  outputName?: string;
}

interface Greetable {
  greet(phrase: string): void; // like an abstract method -- a declaration without an implementation
}

type SocialEntity = Named & Greetable;

class Person implements SocialEntity {
  name: string;
  age = 30;
  constructor(n: string = "") {
    this.name = n;
  }

  greet(phrase: string) {
    console.log(phrase + " " + this.name);
  }
}

let user1: Person;

user1 = new Person();

user1.greet("Hi there - I am");
console.log(user1);
