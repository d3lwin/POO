class colecaoNumeros {
    numeros:number[];

    constructor() {
        this.numeros = [];
    }

    adicionar(numero: number): void {
        this.numeros.push(numero);
    }
    limpar(): void {
        this.numeros = [];
    }
    quantidade(): number {
        return this.numeros.length;
    }
    somar(): number {
        let soma = 0;
        for (let i = 0; i < this.numeros.length; i++) {
            let valor = this.numeros[i];
            if (valor) {soma += valor;}
        }
        return soma
    }
    calcularMedia(): number {
        return this.somar() / this.numeros.length;
    }
    maior(): number | undefined {
        let maior = this.numeros[0];
        if (this.numeros.length == 0) {return undefined;}
        for (let i = 0; i < this.numeros.length; i++) {
            let valor = this.numeros[i];
            if (valor && valor > maior) {maior = valor;}
        }
        return maior;
    }

    menor(): number | undefined {
        let menor = this.numeros[0];
        if (this.numeros.length == 0) {return undefined;}
        for (let i = 0; i < this.numeros.length; i++) {
            let valor = this.numeros[i];
            if (valor && valor < menor) {menor = valor;}
        }
        return menor;
    }
}

let colecao = new colecaoNumeros;
colecao.adicionar(10);
colecao.adicionar(20);
colecao.adicionar(30);
console.log (`Quantidade: ${colecao.quantidade()}
Soma: ${colecao.somar()}
Média: ${colecao.calcularMedia()}
Maior: ${colecao.maior()}
Menor: ${colecao.menor()}`);
colecao.limpar();
colecao.adicionar(-8);
colecao.adicionar(-3);
colecao.adicionar(-12);
console.log (`Quantidade: ${colecao.quantidade()}
Soma: ${colecao.somar()}
Média: ${colecao.calcularMedia()}
Maior: ${colecao.maior()}
Menor: ${colecao.menor()}`);
colecao.limpar();
console.log (`Quantidade: ${colecao.quantidade()}
Soma: ${colecao.somar()}
Média: ${colecao.calcularMedia()}
Maior: ${colecao.maior()}
Menor: ${colecao.menor()}`);