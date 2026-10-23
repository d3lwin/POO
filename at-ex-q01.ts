class Cronometro {
    segundos:number;

    constructor() {
        this.segundos = 0;
    }

    avancar(valor:number):void {
        if (valor >= 0) {this.segundos += valor;}
    }

    zerar():void {
        this.segundos = 0;
    }

    emMinutos():number {
        return this.segundos/60;
    }
}

let teste = new Cronometro();
teste.avancar(90);
console.log(teste);
teste.avancar(30);
console.log(teste);
teste.avancar(-20);
console.log(teste);
teste.zerar();
console.log(teste);

let teste2 = new Cronometro();
teste2.avancar(90);
console.log(teste2);