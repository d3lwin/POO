"use strict";
class Sorteio {
    nomes = [];
    constructor() {
        this.nomes = [];
    }
    Adicionar(nome) {
        this.nomes.push(nome);
    }
    sorteio(min = 0) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(this.nomes.length);
        //Máximo exclusivo, mínimo inclusivo
        return this.nomes[Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)];
    }
}
let sorteio = new Sorteio();
sorteio.Adicionar("João");
sorteio.Adicionar("Pedro");
sorteio.Adicionar("Berto");
sorteio.Adicionar("Davi");
console.log(sorteio.sorteio());
