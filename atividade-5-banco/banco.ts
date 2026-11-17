/**
 * banco.ts
 * ---------------------------------------------------------------------------
 * Exercício 05 de Programação Orientada a Objetos (partes 1 e 2).
 *
 * O arquivo reúne as classes Cliente, Conta e Banco.
 *
 * Decisões de projeto:
 *  - A associação conta <-> cliente é mantida nos dois sentidos:
 *      conta.cliente  e  cliente.contas
 *  - O Banco é o único responsável por criar/desfazer associações, pois é ele
 *    que conhece os dois arrays e consegue aplicar as regras de negócio.
 *  - Operações que podem falhar retornam boolean. Assim o App e os testes
 *    conseguem informar o usuário sem precisar inspecionar arrays internos.
 *  - O saldo só é alterado pelos métodos depositar, sacar, transferir e
 *    atualizarSaldo, todos com validação.
 */

// ===========================================================================
// 1) Classe Cliente  (questão 1 da parte 1)
// ===========================================================================
export class Cliente {
    private _id: number;
    private _nome: string;
    private _cpf: string;
    private _dataNascimento: Date;
    private _contas: Conta[]; // contas associadas a este cliente

    constructor(id: number, nome: string, cpf: string, dataNascimento: Date) {
        this._id = id;
        this._nome = nome;
        this._cpf = cpf;
        this._dataNascimento = dataNascimento;
        this._contas = [];
    }

    get id(): number {
        return this._id;
    }

    get nome(): string {
        return this._nome;
    }

    get cpf(): string {
        return this._cpf;
    }

    get dataNascimento(): Date {
        return this._dataNascimento;
    }

    /**
     * Devolve uma CÓPIA do array. Dessa forma, código externo não consegue
     * alterar a lista interna do cliente sem passar pelas regras do Banco.
     */
    get contas(): Conta[] {
        return [...this._contas];
    }

    set nome(nome: string) {
        this._nome = nome;
    }

    /**
     * Associa uma conta à lista deste cliente.
     * Retorna false se a conta já estiver na lista (regra 4a).
     *
     * Observação: a regra "uma conta só pode ter um único titular" é
     * verificada pelo Banco, que conhece as duas pontas da associação.
     */
    public adicionarConta(conta: Conta): boolean {
        if (this._contas.some((c) => c.id === conta.id)) {
            return false; // evita a mesma conta duplicada no cliente
        }

        this._contas.push(conta);
        return true;
    }

    /**
     * Remove a conta da lista do cliente (não exclui a conta do Banco).
     */
    public removerConta(idConta: number): boolean {
        const indice = this._contas.findIndex((c) => c.id === idConta);

        if (indice === -1) {
            return false;
        }

        this._contas.splice(indice, 1);
        return true;
    }

    public toString(): string {
        return `${this._nome} (id ${this._id}, CPF ${this._cpf})`;
    }
}

// ===========================================================================
// 2) Classe Conta  (questão 2 da parte 1)
// ===========================================================================
export class Conta {
    private _id: number;
    private _numero: string;
    private _saldo: number;
    private _cliente: Cliente | null; // null = conta sem titular
    private _dataDeAbertura: Date;

    constructor(
        id: number,
        numero: string,
        saldoInicial: number = 0,
        dataDeAbertura: Date = new Date()
    ) {
        if (!Number.isFinite(saldoInicial) || saldoInicial < 0) {
            throw new Error("O saldo inicial da conta não pode ser negativo.");
        }

        this._id = id;
        this._numero = numero;
        this._saldo = saldoInicial;
        this._cliente = null; // a associação é feita pelo Banco
        this._dataDeAbertura = dataDeAbertura;
    }

    get id(): number {
        return this._id;
    }

    get numero(): string {
        return this._numero;
    }

    get saldo(): number {
        return this._saldo;
    }

    get cliente(): Cliente | null {
        return this._cliente;
    }

    get dataDeAbertura(): Date {
        return this._dataDeAbertura;
    }

    /**
     * Deposita um valor positivo.
     * Retorna false para valores inválidos (zero, negativos, NaN etc.).
     */
    public depositar(valor: number): boolean {
        if (!Number.isFinite(valor) || valor <= 0) {
            return false;
        }

        this._saldo += valor;
        return true;
    }

    /**
     * Saca um valor positivo, desde que haja saldo suficiente.
     */
    public sacar(valor: number): boolean {
        if (!Number.isFinite(valor) || valor <= 0 || valor > this._saldo) {
            return false;
        }

        this._saldo -= valor;
        return true;
    }

    /**
     * Transfere um valor desta conta para outra.
     * O saque é feito primeiro; se ele falhar, o depósito não acontece.
     */
    public transferir(contaDestino: Conta, valor: number): boolean {
        if (contaDestino === this) {
            return false; // não faz sentido transferir para a própria conta
        }

        if (!this.sacar(valor)) {
            return false; // valor inválido ou saldo insuficiente
        }

        contaDestino.depositar(valor);
        return true;
    }

    /**
     * Atualização administrativa do saldo (usada pelo método Banco.atualizar).
     */
    public atualizarSaldo(novoSaldo: number): boolean {
        if (!Number.isFinite(novoSaldo) || novoSaldo < 0) {
            return false;
        }

        this._saldo = novoSaldo;
        return true;
    }

    /**
     * Liga/desliga a conta de um cliente.
     * Deve ser chamado pelo Banco, que também atualiza a lista do cliente.
     */
    public vincularCliente(cliente: Cliente | null): void {
        this._cliente = cliente;
    }

    public toString(): string {
        return `Conta ${this._numero} (id ${this._id}) - saldo R$ ${this._saldo.toFixed(2)}`;
    }
}

// ===========================================================================
// 3) Classe Banco  (questões 3, 4 e 5 da parte 1 + parte 2)
// ===========================================================================
export class Banco {
    private _contas: Conta[];
    private _clientes: Cliente[];

    constructor() {
        this._contas = [];
        this._clientes = [];
    }

    /** Cópias defensivas para leitura externa (App, testes, relatórios). */
    get contas(): Conta[] {
        return [...this._contas];
    }

    get clientes(): Cliente[] {
        return [...this._clientes];
    }

    // =======================================================================
    // 3.1) Operações com clientes
    // =======================================================================

    /**
     * Insere um cliente respeitando as regras 3f/4c:
     *  - não pode haver dois clientes com o mesmo id;
     *  - não pode haver dois clientes com o mesmo CPF.
     */
    public inserirCliente(cliente: Cliente): boolean {
        if (this._clientes.some((c) => c.id === cliente.id)) {
            console.log(`Erro: já existe cliente com id ${cliente.id}.`);
            return false;
        }

        if (this._clientes.some((c) => c.cpf === cliente.cpf)) {
            console.log(`Erro: já existe cliente com CPF ${cliente.cpf}.`);
            return false;
        }

        this._clientes.push(cliente);
        return true;
    }

    /**
     * Consulta um cliente pelo CPF.
     * Retorna null quando não encontra (mais seguro que retornar undefined).
     */
    public consultarCliente(cpf: string): Cliente | null {
        return this._clientes.find((c) => c.cpf === cpf) ?? null;
    }

    /**
     * Associa uma conta a um cliente (questão 3c).
     *
     * Regras aplicadas:
     *  - cliente e conta precisam existir;
     *  - a conta não pode pertencer a outro cliente (regra 4b);
     *  - a mesma conta não pode ser adicionada duas vezes ao mesmo cliente (4a).
     */
    public associarContaCliente(numeroConta: string, cpfCliente: string): boolean {
        const cliente = this.consultarCliente(cpfCliente);

        if (!cliente) {
            console.log(`Erro: cliente com CPF ${cpfCliente} não encontrado.`);
            return false;
        }

        const conta = this.consultarPorNumero(numeroConta);

        if (!conta) {
            console.log(`Erro: conta ${numeroConta} não encontrada.`);
            return false;
        }

        // A conta já pertence a outro cliente?
        if (conta.cliente && conta.cliente.id !== cliente.id) {
            console.log(
                `Erro: a conta ${numeroConta} já pertence ao cliente ${conta.cliente.nome}.`
            );
            return false;
        }

        // A conta já está na lista deste cliente?
        if (cliente.contas.some((c) => c.id === conta.id)) {
            console.log(`Erro: a conta ${numeroConta} já está associada a este cliente.`);
            return false;
        }

        // Cria a associação nas duas pontas.
        conta.vincularCliente(cliente);
        cliente.adicionarConta(conta);
        return true;
    }

    /** Lista as contas de um cliente pelo CPF (questão 3d). */
    public listarContasCliente(cpf: string): Conta[] {
        const cliente = this.consultarCliente(cpf);
        return cliente ? cliente.contas : [];
    }

    /** Soma o saldo de todas as contas de um cliente (questão 3e). */
    public totalizarSaldoCliente(cpf: string): number {
        const cliente = this.consultarCliente(cpf);

        if (!cliente) {
            return 0;
        }

        return cliente.contas.reduce((total, conta) => total + conta.saldo, 0);
    }

    // =======================================================================
    // 3.2) Operações com contas
    // =======================================================================

    /**
     * Insere uma conta respeitando as regras 3g/4c:
     *  - não pode haver duas contas com o mesmo id;
     *  - não pode haver duas contas com o mesmo número.
     */
    public inserirConta(conta: Conta): boolean {
        if (this._contas.some((c) => c.id === conta.id)) {
            console.log(`Erro: já existe conta com id ${conta.id}.`);
            return false;
        }

        if (this._contas.some((c) => c.numero === conta.numero)) {
            console.log(`Erro: já existe conta com número ${conta.numero}.`);
            return false;
        }

        this._contas.push(conta);
        return true;
    }

    /** Consulta uma conta pelo id (método original da aula). */
    public consultar(id: number): Conta | null {
        return this._contas.find((c) => c.id === id) ?? null;
    }

    /**
     * Consulta uma conta pelo número. A parte 2 pede que o Banco receba
     * strings (número da conta/CPF) e faça a busca internamente.
     */
    public consultarPorNumero(numero: string): Conta | null {
        return this._contas.find((c) => c.numero === numero) ?? null;
    }

    /**
     * Exclui uma conta pelo número.
     *
     * Decisão (questão 2g): o cliente continua cadastrado; apenas a conta é
     * removida da lista dele e do Banco. Assim o histórico do cliente é
     * preservado e ele pode continuar tendo outras contas.
     */
    public excluirConta(numero: string): boolean {
        const conta = this.consultarPorNumero(numero);

        if (!conta) {
            console.log(`Erro: conta ${numero} não encontrada.`);
            return false;
        }

        if (conta.cliente) {
            conta.cliente.removerConta(conta.id);
            conta.vincularCliente(null);
        }

        this._contas = this._contas.filter((c) => c.id !== conta.id);
        return true;
    }

    /**
     * Nome mantido por compatibilidade com o método `excluir` de aula.ts.
     * A implementação real fica em excluirConta.
     */
    public excluir(numero: string): boolean {
        return this.excluirConta(numero);
    }

    /**
     * Atualiza o saldo de uma conta (operação administrativa).
     * Retorna false se a conta não existir ou se o saldo for negativo.
     */
    public atualizar(numero: string, novoSaldo: number): boolean {
        const conta = this.consultarPorNumero(numero);

        if (!conta) {
            console.log(`Erro: conta ${numero} não encontrada.`);
            return false;
        }

        if (!conta.atualizarSaldo(novoSaldo)) {
            console.log("Erro: o novo saldo não pode ser negativo.");
            return false;
        }

        return true;
    }

    /** Deposita em uma conta identificada pelo número. */
    public depositar(numero: string, valor: number): boolean {
        const conta = this.consultarPorNumero(numero);

        if (!conta) {
            console.log(`Erro: conta ${numero} não encontrada.`);
            return false;
        }

        if (!conta.depositar(valor)) {
            console.log("Erro: o valor do depósito deve ser positivo.");
            return false;
        }

        return true;
    }

    /** Saca de uma conta identificada pelo número. */
    public sacar(numero: string, valor: number): boolean {
        const conta = this.consultarPorNumero(numero);

        if (!conta) {
            console.log(`Erro: conta ${numero} não encontrada.`);
            return false;
        }

        if (!conta.sacar(valor)) {
            console.log("Erro: valor inválido ou saldo insuficiente.");
            return false;
        }

        return true;
    }

    /** Transfere de uma conta para outra, ambas identificadas pelo número. */
    public transferir(numeroOrigem: string, numeroDestino: string, valor: number): boolean {
        if (numeroOrigem === numeroDestino) {
            console.log("Erro: a conta de origem e a de destino devem ser diferentes.");
            return false;
        }

        const origem = this.consultarPorNumero(numeroOrigem);

        if (!origem) {
            console.log(`Erro: conta de origem ${numeroOrigem} não encontrada.`);
            return false;
        }

        const destino = this.consultarPorNumero(numeroDestino);

        if (!destino) {
            console.log(`Erro: conta de destino ${numeroDestino} não encontrada.`);
            return false;
        }

        if (!origem.transferir(destino, valor)) {
            console.log("Erro: valor inválido ou saldo insuficiente na conta de origem.");
            return false;
        }

        return true;
    }

    /**
     * Ordem bancária (questão 2a): transfere o mesmo valor da conta de origem
     * para cada conta destino do array.
     *
     * Retorna quantas transferências foram realizadas com sucesso. Se uma
     * conta destino não existir ou o saldo acabar, as demais continuam sendo
     * tentadas e os erros são informados individualmente.
     */
    public transferirParaVarias(
        numeroOrigem: string,
        numerosDestino: string[],
        valor: number
    ): number {
        let realizadas = 0;

        for (const numeroDestino of numerosDestino) {
            if (this.transferir(numeroOrigem, numeroDestino, valor)) {
                realizadas++;
            }
        }

        return realizadas;
    }

    // =======================================================================
    // 3.3) Relatórios (questão 2b, 2c e 2d)
    // =======================================================================

    /** Quantidade de contas cadastradas no Banco. */
    public quantidadeContas(): number {
        return this._contas.length;
    }

    /** Total de dinheiro depositado em todas as contas. */
    public totalDinheiro(): number {
        return this._contas.reduce((total, conta) => total + conta.saldo, 0);
    }

    /**
     * Média de saldo por conta. Chama os dois métodos anteriores, conforme
     * pedido na questão 2d.
     */
    public mediaSaldo(): number {
        const quantidade = this.quantidadeContas();

        if (quantidade === 0) {
            return 0; // evita divisão por zero
        }

        return this.totalDinheiro() / quantidade;
    }

    // =======================================================================
    // 3.4) Titularidade e exclusão de clientes (questões 2e, 2f, 2g e 2h)
    // =======================================================================

    /**
     * Muda o titular de uma conta (questão 2e).
     * Remove a conta do cliente antigo e a adiciona ao novo.
     */
    public mudarTitularidade(numeroConta: string, cpfNovoCliente: string): boolean {
        const conta = this.consultarPorNumero(numeroConta);

        if (!conta) {
            console.log(`Erro: conta ${numeroConta} não encontrada.`);
            return false;
        }

        const novoCliente = this.consultarCliente(cpfNovoCliente);

        if (!novoCliente) {
            console.log(`Erro: cliente com CPF ${cpfNovoCliente} não encontrado.`);
            return false;
        }

        if (conta.cliente && conta.cliente.id === novoCliente.id) {
            console.log("Erro: o cliente informado já é o titular desta conta.");
            return false;
        }

        // Desfaz a associação antiga...
        if (conta.cliente) {
            conta.cliente.removerConta(conta.id);
        }

        // ...e cria a nova.
        conta.vincularCliente(novoCliente);
        novoCliente.adicionarConta(conta);
        return true;
    }

    /**
     * Exclui um cliente pelo CPF (questão 2f).
     *
     * Decisão tomada: as contas NÃO são apagadas. Elas permanecem no Banco,
     * porém sem titular (cliente = null). Isso preserva os saldos e permite
     * reatribuir a titularidade depois (questão 2h).
     */
    public excluirCliente(cpf: string): boolean {
        const cliente = this.consultarCliente(cpf);

        if (!cliente) {
            console.log(`Erro: cliente com CPF ${cpf} não encontrado.`);
            return false;
        }

        // `cliente.contas` devolve uma cópia; podemos percorrê-la com segurança.
        for (const conta of cliente.contas) {
            conta.vincularCliente(null);
            cliente.removerConta(conta.id);
        }

        this._clientes = this._clientes.filter((c) => c.id !== cliente.id);
        return true;
    }

    /**
     * Lista contas sem titular (questão 2h).
     */
    public listarContasSemCliente(): Conta[] {
        return this._contas.filter((conta) => conta.cliente === null);
    }

    /**
     * Atribui titularidade a uma conta que está sem cliente (questão 2h).
     * Para trocar o titular de uma conta que já possui dono, use
     * mudarTitularidade.
     */
    public atribuirTitularidade(numeroConta: string, cpfCliente: string): boolean {
        const conta = this.consultarPorNumero(numeroConta);

        if (!conta) {
            console.log(`Erro: conta ${numeroConta} não encontrada.`);
            return false;
        }

        if (conta.cliente !== null) {
            console.log(
                `Erro: a conta ${numeroConta} já possui titular. Use a mudança de titularidade.`
            );
            return false;
        }

        return this.associarContaCliente(numeroConta, cpfCliente);
    }

    // =======================================================================
    // 3.5) Utilidades
    // =======================================================================

    /** Próximo id livre para uma conta (usado pelo App). */
    public proximoIdConta(): number {
        return this._contas.reduce((maior, conta) => Math.max(maior, conta.id), 0) + 1;
    }

    /** Próximo id livre para um cliente (usado pelo App). */
    public proximoIdCliente(): number {
        return this._clientes.reduce((maior, cliente) => Math.max(maior, cliente.id), 0) + 1;
    }

    /**
     * Carga inicial (questão 4 da parte 2): pelo menos 5 clientes, 5 contas e
     * algumas associações. João possui duas contas para demonstrar a regra
     * "um cliente pode ter várias contas". Carlos fica sem conta.
     */
    public carregarDados(): void {
        const joao = new Cliente(1, "João Silva", "111.111.111-11", new Date(1980, 5, 15));
        const maria = new Cliente(2, "Maria Oliveira", "222.222.222-22", new Date(1985, 3, 20));
        const pedro = new Cliente(3, "Pedro Santos", "333.333.333-33", new Date(1990, 1, 10));
        const ana = new Cliente(4, "Ana Costa", "444.444.444-44", new Date(1995, 8, 5));
        const carlos = new Cliente(5, "Carlos Lima", "555.555.555-55", new Date(1988, 11, 2));

        this.inserirCliente(joao);
        this.inserirCliente(maria);
        this.inserirCliente(pedro);
        this.inserirCliente(ana);
        this.inserirCliente(carlos);

        const conta1 = new Conta(101, "0001-1", 1000, new Date(2024, 0, 10));
        const conta2 = new Conta(102, "0002-2", 2500, new Date(2024, 2, 5));
        const conta3 = new Conta(103, "0003-3", 750, new Date(2024, 4, 22));
        const conta4 = new Conta(104, "0004-4", 300, new Date(2024, 7, 1));
        const conta5 = new Conta(105, "0005-5", 5000, new Date(2025, 0, 15));

        this.inserirConta(conta1);
        this.inserirConta(conta2);
        this.inserirConta(conta3);
        this.inserirConta(conta4);
        this.inserirConta(conta5);

        // Associações iniciais.
        this.associarContaCliente("0001-1", joao.cpf);
        this.associarContaCliente("0002-2", joao.cpf); // João com duas contas
        this.associarContaCliente("0003-3", maria.cpf);
        this.associarContaCliente("0004-4", pedro.cpf);
        this.associarContaCliente("0005-5", ana.cpf);
        // Carlos permanece sem conta, o que permite testar a atribuição
        // posterior de titularidade.
    }
}
