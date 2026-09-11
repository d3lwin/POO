class Sorteio {
    public nomes:Array<string>

    public constructor() {
    this.nomes = [];
    }

    public Adicionar(nome:string){
        this.nomes.push(nome)
    }

    public sorteio(min:number = 0) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(this.nomes.length);

    //Máximo exclusivo, mínimo inclusivo
    return this.nomes[Math.floor(Math.random() * (maxFloored-minCeiled) + minCeiled)]
}
}

let sorteio:Sorteio = new Sorteio()
sorteio.Adicionar("João")
sorteio.Adicionar("Pedro")
sorteio.Adicionar("Berto")
sorteio.Adicionar("Davi")

console.log(sorteio.sorteio())