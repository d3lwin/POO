let numeros : number[] = [1, 2, 3, 4];
let numeros_dobro = numeros.map(x => 2*x);
console.log(numeros)
console.log(numeros_dobro)

let soma = numeros_dobro.reduce((y, x) => y+x)
console.log(soma)