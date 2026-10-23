class Estacionamento{
    placa:string;
    horas:number;

    constructor(placa:string){
        this.placa = placa;
        this.horas = 0;
    }

    registrarPermanencia(horas: number): void {
        if (horas >= 0) {this.horas = horas;}
    }

    calcularHorasCobradas(): number {
        return Math.ceil(this.horas / 1);
    }

    calcularValor(): number {
        let horas = this.calcularHorasCobradas()
        if (horas!=0) {return 8 + (horas - 1)*5;} else {
            return 0;
        }
    }

    emitirTicket(): string {  //retorna placa, horas cobradas e valor
        return `Placa: ${this.placa}
                Horas: ${this.calcularHorasCobradas()}
                Valor a pagar: ${this.calcularValor()}`;
    }
}

let estaciona = new Estacionamento("ac1v2");
estaciona.registrarPermanencia(0);
console.log(estaciona.emitirTicket());
estaciona.registrarPermanencia(1);
console.log(estaciona.emitirTicket());
estaciona.registrarPermanencia(1.2);
console.log(estaciona.emitirTicket());
estaciona.registrarPermanencia(3.5);
console.log(estaciona.emitirTicket());