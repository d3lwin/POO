class TradutorEmojis {
    dicionario: { [palavra: string]: string } = {
        "amor": "❤️",
        "futebol": "⚽",
        "cachorro": "🐕",
        "gato": "🐈"}

    frase:string

    public constructor(frase:string){
        this.frase = frase
    }
    
    public traduzir():string {
        let palavras = this.frase.split(" ")
        let termos = Object.keys(this.dicionario);
        let emojis = Object.values(this.dicionario);
        let fraseTraduzida = ""
        
        palavras.forEach((palavra, index) => {
            if (termos.includes(palavra)) {
                let termo = termos.indexOf(palavra)
                fraseTraduzida = fraseTraduzida + `${emojis[termo]} `
            } else {
                fraseTraduzida = fraseTraduzida + `${palavra} `
            }
        })

        return fraseTraduzida
    }
};

let frase:TradutorEmojis = new TradutorEmojis("O amor do homem é o cachorro")
console.log(frase.traduzir())