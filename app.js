import { HashMap } from "./HashMap.js";

const map = new HashMap(3, 1.0);
map.set("first", 9);
map.set("second", 10);
map.set("Sita", 1);
map.set("Rama", 0);
console.log(map.toString());
// map.clear();
console.log(map.toString());

console.log(map.has("Rama"));
console.log(map.has("Ramaa"));

console.log(map.remove("first"));
// console.log(map.remove("second"));
console.log(map.remove("firstdd"));
console.log(map.has("first"));
console.log(map.toString());

console.log(map.values());
console.log(map.entries());
map.set("second", 11);

console.log(map.entries());
