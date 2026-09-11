"use strict";
class JogoParImpar {
    numero;
    numeroMaquina;
    constructor(numero) {
        this.numero = numero;
        this.numeroMaquina = this.sortearMaquina();
    }
    sortearMaquina() {
        const minCeiled = Math.ceil(1);
        const maxFloored = Math.floor(11);
        //Máximo exclusivo, mínimo inclusivo
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    }
    resultado() {
        if ((this.numero + this.numeroMaquina) % 2 === 0) {
            return "Par";
        }
        else {
            return "Ímpar";
        }
    }
    vencedor() {
        if (this.resultado() === "Par") {
            return "Jogador";
        }
        else {
            return "Máquina";
        }
    }
}
let jogo = new JogoParImpar(2);
console.log(jogo.vencedor());
