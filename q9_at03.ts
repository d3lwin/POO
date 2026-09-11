let nomes: Array<string> = ["Ana", "Bruno", "Carlos"];
let nomes_num = nomes.length

function sorteio(min:number, max:number):number {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);

    //Máximo exclusivo, mínimo inclusivo
    return Math.floor(Math.random() * (maxFloored-minCeiled) + minCeiled)
}

let sorteado = nomes[sorteio(0, nomes_num)]
console.log(sorteado)