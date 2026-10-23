class Impressora {
    paginas:number;
    colorida:boolean;
    totalPaginasImpressas:number;
    valorTotalImpresso:number;

    constructor () {
        this.paginas = 0;
        this.colorida = false;
        this.totalPaginasImpressas = 0;
        this.valorTotalImpresso = 0;
    }
    
    inicializarPedido(paginas: number, colorida: boolean): void {
        if (paginas >= 0 && Number.isInteger(paginas)) {
            this.paginas = paginas;
            this.colorida = colorida;
        } else {console.log("Pedido inválido!!")}
    }

    calcularValor(): number {
        if (this.colorida) {
            return this.paginas * 0.8;
        } else {
            return this.paginas * 0.25;
        }
    }

    imprimir(): void {
        this.totalPaginasImpressas += this.paginas;
        this.valorTotalImpresso += this.calcularValor()
    }
}

let impressora1 = new Impressora;
impressora1.inicializarPedido(10, false);
impressora1.imprimir();
impressora1.inicializarPedido(10, true);
impressora1.imprimir();
console.log(impressora1);
console.log(impressora1.calcularValor());
let impressora2 = new Impressora;
console.log(impressora2);