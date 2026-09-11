"use strict";
const numeros = [2, 4, 6, 8, 10];
let numeros_dobro = numeros.map(x => 2 * x);
console.log(numeros);
console.log(numeros_dobro);
let soma = numeros_dobro.reduce((y, x) => y + x);
console.log(soma);
