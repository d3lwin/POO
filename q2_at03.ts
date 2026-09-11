let numeros: Array<number> =[1, 2, 3, 4];
let string: string = ""

numeros.forEach((numero, index) => {
    if (index == numeros.length - 1) {
        string = string + `${numero}`
    } else {
        string = string + `${numero}-`
    }
})

console.log(string)