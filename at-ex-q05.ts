class registroTemperaturas {
    temperaturas:number[];
    limiteAlerta:number;

    constructor(){
        this.temperaturas = [];
        this.limiteAlerta = 30;
    }

    adicionar(temperatura: number): void{
        this.temperaturas.push(temperatura);
    }
    
    alterarLimite(limite: number): void {
        this.limiteAlerta = limite;
    }

    listar(): string {
        let texto = ``
        this.temperaturas.forEach((temperatura, indice) => {
            texto += `Dia ${indice+1}: ${temperatura}°C\n`;
        })
        return texto
    }

    acimaDoLimite(): number[] {
        return this.temperaturas.filter(temperatura => temperatura > this.limiteAlerta)
    }

    converterParaFarenheit(): number[] {
        return this.temperaturas.map(celsius => celsius * 1.8 + 32)
    }

    calcularMedia(): number {
        return this.temperaturas.reduce((soma, temperatura) => soma + temperatura, 0) / this.temperaturas.length
    }
}

let temperaturas = new registroTemperaturas;
console.log(temperaturas.listar().trim());
console.log(temperaturas.calcularMedia());
console.log(temperaturas.acimaDoLimite());
console.log(temperaturas.converterParaFarenheit());
console.log(" ");
temperaturas.adicionar(28);
temperaturas.adicionar(31);
temperaturas.adicionar(29);
temperaturas.adicionar(35);
temperaturas.adicionar(32);
temperaturas.adicionar(27);
temperaturas.adicionar(30);
console.log(temperaturas.listar().trim());
console.log(temperaturas.calcularMedia());
console.log(temperaturas.acimaDoLimite());
console.log(temperaturas.converterParaFarenheit());
console.log(" ");
temperaturas.alterarLimite(32);
console.log(temperaturas.listar().trim());
console.log(temperaturas.acimaDoLimite());