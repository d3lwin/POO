class JogoParImpar {
    public numero:number
    public numeroMaquina:number

    public constructor(numero:number) {
    this.numero = numero;
    this.numeroMaquina = this.sortearMaquina()
    }

    public sortearMaquina():number {
    const minCeiled = Math.ceil(1);
    const maxFloored = Math.floor(11);

    //Máximo exclusivo, mínimo inclusivo
    return Math.floor(Math.random() * (maxFloored-minCeiled) + minCeiled)
    }

    public resultado():string{
        if((this.numero+this.numeroMaquina)%2 === 0){
            return "Par"
        } else {
            return "Ímpar"
        }
    }

    public vencedor():string{
        if (this.resultado() === "Par"){
            return "Jogador"
        } else {
            return "Máquina"
        }
    }
}

let jogo:JogoParImpar = new JogoParImpar(2)
console.log(jogo.vencedor())