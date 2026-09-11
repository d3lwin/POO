"use strict";
class TradutorEmojis {
    dicionario = {
        "amor": "❤️",
        "futebol": "⚽",
        "cachorro": "🐕",
        "gato": "🐈"
    };
    frase;
    constructor(frase) {
        this.frase = frase;
    }
    traduzir() {
        let palavras = this.frase.split(" ");
        let termos = Object.keys(this.dicionario);
        let emojis = Object.values(this.dicionario);
        let fraseTraduzida = "";
        palavras.forEach((palavra, index) => {
            if (termos.includes(palavra)) {
                let termo = termos.indexOf(palavra);
                fraseTraduzida = fraseTraduzida + `${emojis[termo]} `;
            }
            else {
                fraseTraduzida = fraseTraduzida + `${palavra} `;
            }
        });
        return fraseTraduzida;
    }
}
;
let frase = new TradutorEmojis("O amor do homem é o cachorro");
console.log(frase.traduzir());
