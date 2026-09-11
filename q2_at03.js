"use strict";
let numeros = [1, 2, 3, 4];
let string = "";
function concatenaNumero(string, numero) {
    string = string + `${numero}-`;
}
numeros.forEach((numero, index) => {
    if (index == numeros.length - 1) {
        string = string + `${numero}`;
    }
    else {
        string = string + `${numero}-`;
    }
});
console.log(string);
