/**
 * app.ts
 * ---------------------------------------------------------------------------
 * Aplicação de console do Exercício 05 (parte 2, questões 5 e 6).
 *
 * A aplicação foi transformada na classe App, que possui:
 *  - um atributo do tipo Banco;
 *  - métodos de menu e de operação (inserirConta, sacar, transferir etc.);
 *  - leitura de dados com prompt-sync.
 *
 * Códigos das funcionalidades:
 *  - Contas:  00 a 09  (conforme pedido: começam com 00)
 *  - Clientes: 20 a 25 (conforme pedido: começam com 20)
 *  - 0: sair
 */

import promptSync from "prompt-sync";
import { Banco, Cliente, Conta } from "./banco";

// Tipo do prompt criado pela biblioteca prompt-sync.
type Prompt = ReturnType<typeof promptSync>;

export class App {
    private banco: Banco;
    private input: Prompt;

    constructor() {
        this.banco = new Banco();
        this.input = promptSync();
    }

    // =======================================================================
    // Inicialização e menu principal
    // =======================================================================

    /** Faz a carga inicial e inicia o menu. */
    public iniciar(): void {
        this.carregarDados();
        this.menu();
    }

    /** Carga inicial de 5 clientes, 5 contas e algumas associações. */
    public carregarDados(): void {
        this.banco.carregarDados();
        console.log("Dados iniciais carregados.");
    }

    /** Loop principal do sistema. */
    public menu(): void {
        let opcao = "";

        do {
            this.exibirMenu();
            opcao = this.lerTexto("Opção: ");

            switch (opcao) {
                // --------------------- Contas ---------------------
                case "00":
                    this.inserirConta();
                    break;
                case "01":
                    this.consultarConta();
                    break;
                case "02":
                    this.sacar();
                    break;
                case "03":
                    this.depositar();
                    break;
                case "04":
                    this.transferir();
                    break;
                case "05":
                    this.excluirConta();
                    break;
                case "06":
                    this.atualizarConta();
                    break;
                case "07":
                    this.transferirParaVarias();
                    break;
                case "08":
                    this.menuTitularidade();
                    break;
                case "09":
                    this.relatorios();
                    break;

                // --------------------- Clientes -------------------
                case "20":
                    this.inserirCliente();
                    break;
                case "21":
                    this.consultarCliente();
                    break;
                case "22":
                    this.associarContaCliente();
                    break;
                case "23":
                    this.excluirCliente();
                    break;
                case "24":
                    this.listarContasCliente();
                    break;
                case "25":
                    this.totalizarSaldoCliente();
                    break;

                case "0":
                    console.log("\nAplicação encerrada.");
                    break;

                default:
                    console.log("Opção inválida. Tente novamente.");
            }

            if (opcao !== "0") {
                this.pausar();
            }
        } while (opcao !== "0");
    }

    private exibirMenu(): void {
        console.log(`
================ SISTEMA BANCÁRIO ================
Contas:
  00 - Inserir conta
  01 - Consultar conta
  02 - Sacar
  03 - Depositar
  04 - Transferir
  05 - Excluir conta
  06 - Atualizar saldo
  07 - Transferir para várias contas
  08 - Titularidade (listar sem titular / atribuir / mudar)
  09 - Relatórios (quantidade, total e média)

Clientes:
  20 - Inserir cliente
  21 - Consultar cliente
  22 - Associar conta a cliente
  23 - Excluir cliente
  24 - Listar contas do cliente
  25 - Totalizar saldo do cliente

   0 - Sair
==================================================`);
    }

    // =======================================================================
    // Funções auxiliares de entrada de dados
    // =======================================================================

    private lerTexto(mensagem: string): string {
        return this.input(mensagem).trim();
    }

    private lerNumero(mensagem: string): number | null {
        const texto = this.input(mensagem).trim().replace(",", ".");

        if (texto === "") {
            console.log("Valor não informado.");
            return null;
        }

        const valor = Number(texto);

        if (!Number.isFinite(valor)) {
            console.log("Valor inválido.");
            return null;
        }

        return valor;
    }

    private lerData(mensagem: string): Date | null {
        const texto = this.input(mensagem).trim();
        const partes = texto.split("/");

        if (partes.length !== 3) {
            console.log("Data inválida. Use o formato dd/mm/aaaa.");
            return null;
        }

        const dia = Number(partes[0]);
        const mes = Number(partes[1]);
        const ano = Number(partes[2]);

        if (
            !Number.isInteger(dia) ||
            !Number.isInteger(mes) ||
            !Number.isInteger(ano) ||
            dia < 1 ||
            mes < 1 ||
            mes > 12 ||
            ano < 1900
        ) {
            console.log("Data inválida.");
            return null;
        }

        const data = new Date(ano, mes - 1, dia);

        // Verifica se a data existe de fato (ex.: 31/02 seria ajustado).
        if (
            data.getFullYear() !== ano ||
            data.getMonth() !== mes - 1 ||
            data.getDate() !== dia
        ) {
            console.log("Data inválida.");
            return null;
        }

        return data;
    }

    private confirmar(mensagem: string): boolean {
        return this.lerTexto(`${mensagem} (s/N): `).toLowerCase() === "s";
    }

    private pausar(): void {
        this.input("\nPressione <enter> para continuar...");
    }

    private mostrarSaldo(numero: string): void {
        const conta = this.banco.consultarPorNumero(numero);

        if (conta) {
            console.log(`Saldo atual da conta ${numero}: R$ ${conta.saldo.toFixed(2)}`);
        }
    }

    // =======================================================================
    // Funcionalidades de conta (00 a 09)
    // =======================================================================

    private inserirConta(): void {
        console.log("\n--- Inserir conta ---");

        const numero = this.lerTexto("Número da conta (deve começar com 00): ");

        if (!numero.startsWith("00")) {
            console.log("Erro: o número da conta deve começar com 00.");
            return;
        }

        const saldo = this.lerNumero("Saldo inicial: ");

        if (saldo === null) {
            return;
        }

        if (saldo < 0) {
            console.log("Erro: o saldo inicial não pode ser negativo.");
            return;
        }

        const conta = new Conta(this.banco.proximoIdConta(), numero, saldo);

        if (this.banco.inserirConta(conta)) {
            console.log(
                `Conta ${numero} criada com sucesso (id ${conta.id}, saldo R$ ${conta.saldo.toFixed(2)}).`
            );
        }
    }

    private consultarConta(): void {
        console.log("\n--- Consultar conta ---");

        const numero = this.lerTexto("Número da conta: ");
        const conta = this.banco.consultarPorNumero(numero);

        if (!conta) {
            console.log("Conta não encontrada.");
            return;
        }

        console.log(`Conta: ${conta.numero} (id ${conta.id})`);
        console.log(`Saldo: R$ ${conta.saldo.toFixed(2)}`);
        console.log(`Titular: ${conta.cliente ? conta.cliente.nome : "sem titular"}`);
        console.log(`Data de abertura: ${conta.dataDeAbertura.toLocaleDateString("pt-BR")}`);
    }

    private sacar(): void {
        console.log("\n--- Sacar ---");

        const numero = this.lerTexto("Número da conta: ");
        const valor = this.lerNumero("Valor do saque: ");

        if (valor === null) {
            return;
        }

        if (this.banco.sacar(numero, valor)) {
            console.log(`Saque de R$ ${valor.toFixed(2)} realizado.`);
            this.mostrarSaldo(numero);
        }
    }

    private depositar(): void {
        console.log("\n--- Depositar ---");

        const numero = this.lerTexto("Número da conta: ");
        const valor = this.lerNumero("Valor do depósito: ");

        if (valor === null) {
            return;
        }

        if (this.banco.depositar(numero, valor)) {
            console.log(`Depósito de R$ ${valor.toFixed(2)} realizado.`);
            this.mostrarSaldo(numero);
        }
    }

    private transferir(): void {
        console.log("\n--- Transferir ---");

        const origem = this.lerTexto("Número da conta de origem: ");
        const destino = this.lerTexto("Número da conta de destino: ");
        const valor = this.lerNumero("Valor da transferência: ");

        if (valor === null) {
            return;
        }

        if (this.banco.transferir(origem, destino, valor)) {
            console.log(`Transferência de R$ ${valor.toFixed(2)} realizada.`);
            this.mostrarSaldo(origem);
            this.mostrarSaldo(destino);
        }
    }

    private excluirConta(): void {
        console.log("\n--- Excluir conta ---");

        const numero = this.lerTexto("Número da conta: ");

        if (!this.confirmar(`Confirma a exclusão da conta ${numero}?`)) {
            console.log("Operação cancelada.");
            return;
        }

        if (this.banco.excluirConta(numero)) {
            console.log("Conta excluída. O cliente permanece cadastrado no Banco.");
        }
    }

    private atualizarConta(): void {
        console.log("\n--- Atualizar saldo ---");

        const numero = this.lerTexto("Número da conta: ");
        const novoSaldo = this.lerNumero("Novo saldo: ");

        if (novoSaldo === null) {
            return;
        }

        if (this.banco.atualizar(numero, novoSaldo)) {
            console.log(`Saldo da conta ${numero} atualizado para R$ ${novoSaldo.toFixed(2)}.`);
        }
    }

    private transferirParaVarias(): void {
        console.log("\n--- Transferência para várias contas ---");

        const origem = this.lerTexto("Número da conta de origem: ");
        const destinosTexto = this.lerTexto("Contas destino (separadas por vírgula): ");

        const destinos = destinosTexto
            .split(",")
            .map((numero) => numero.trim())
            .filter((numero) => numero !== "");

        if (destinos.length === 0) {
            console.log("Nenhuma conta destino informada.");
            return;
        }

        const valor = this.lerNumero("Valor a transferir para cada conta: ");

        if (valor === null) {
            return;
        }

        const realizadas = this.banco.transferirParaVarias(origem, destinos, valor);

        console.log(
            `${realizadas} de ${destinos.length} transferência(s) realizada(s) com sucesso.`
        );
        this.mostrarSaldo(origem);
    }

    /**
     * Submenu de titularidade: reúne a listagem de contas sem titular (com
     * atribuição imediata) e a mudança de titular de uma conta.
     */
    private menuTitularidade(): void {
        console.log("\n--- Titularidade ---");
        console.log("1 - Listar contas sem titular e atribuir");
        console.log("2 - Mudar titularidade de uma conta");

        const opcao = this.lerTexto("Opção: ");

        if (opcao === "1") {
            this.contasSemTitular();
        } else if (opcao === "2") {
            this.mudarTitularidade();
        } else {
            console.log("Opção inválida.");
        }
    }

    private contasSemTitular(): void {
        console.log("\n--- Contas sem titular ---");

        const contas = this.banco.listarContasSemCliente();

        if (contas.length === 0) {
            console.log("Todas as contas possuem titular.");
            return;
        }

        console.log(`Contas sem titular (${contas.length}):`);

        for (const conta of contas) {
            console.log(` - ${conta.numero} (id ${conta.id}) - saldo R$ ${conta.saldo.toFixed(2)}`);
        }

        if (!this.confirmar("Deseja atribuir titularidade a uma dessas contas?")) {
            return;
        }

        const numero = this.lerTexto("Número da conta: ");
        const cpf = this.lerTexto("CPF do novo titular: ");

        if (this.banco.atribuirTitularidade(numero, cpf)) {
            console.log("Titularidade atribuída com sucesso.");
        }
    }

    private mudarTitularidade(): void {
        console.log("\n--- Mudar titularidade ---");

        const numero = this.lerTexto("Número da conta: ");
        const cpf = this.lerTexto("CPF do novo titular: ");

        if (this.banco.mudarTitularidade(numero, cpf)) {
            console.log("Titularidade alterada com sucesso.");
        }
    }

    private relatorios(): void {
        console.log("\n--- Relatórios ---");
        console.log(`Quantidade de contas: ${this.banco.quantidadeContas()}`);
        console.log(`Total depositado: R$ ${this.banco.totalDinheiro().toFixed(2)}`);
        console.log(`Média de saldo por conta: R$ ${this.banco.mediaSaldo().toFixed(2)}`);
    }

    // =======================================================================
    // Funcionalidades de cliente (20 a 25)
    // =======================================================================

    private inserirCliente(): void {
        console.log("\n--- Inserir cliente ---");

        const nome = this.lerTexto("Nome completo: ");

        if (nome === "") {
            console.log("Erro: o nome não pode ficar em branco.");
            return;
        }

        const cpf = this.lerTexto("CPF: ");

        if (cpf === "") {
            console.log("Erro: o CPF não pode ficar em branco.");
            return;
        }

        const dataNascimento = this.lerData("Data de nascimento (dd/mm/aaaa): ");

        if (dataNascimento === null) {
            return;
        }

        const cliente = new Cliente(
            this.banco.proximoIdCliente(),
            nome,
            cpf,
            dataNascimento
        );

        if (this.banco.inserirCliente(cliente)) {
            console.log(`Cliente ${nome} cadastrado com sucesso (id ${cliente.id}).`);
        }
    }

    private consultarCliente(): void {
        console.log("\n--- Consultar cliente ---");

        const cpf = this.lerTexto("CPF do cliente: ");
        const cliente = this.banco.consultarCliente(cpf);

        if (!cliente) {
            console.log("Cliente não encontrado.");
            return;
        }

        console.log(`Nome: ${cliente.nome}`);
        console.log(`Id: ${cliente.id}`);
        console.log(`CPF: ${cliente.cpf}`);
        console.log(`Data de nascimento: ${cliente.dataNascimento.toLocaleDateString("pt-BR")}`);
        console.log(`Contas (${cliente.contas.length}):`);

        for (const conta of cliente.contas) {
            console.log(` - ${conta.numero} (id ${conta.id}) - saldo R$ ${conta.saldo.toFixed(2)}`);
        }
    }

    private associarContaCliente(): void {
        console.log("\n--- Associar conta a cliente ---");

        const numero = this.lerTexto("Número da conta: ");
        const cpf = this.lerTexto("CPF do cliente: ");

        if (this.banco.associarContaCliente(numero, cpf)) {
            console.log("Conta associada ao cliente com sucesso.");
        }
    }

    private excluirCliente(): void {
        console.log("\n--- Excluir cliente ---");

        const cpf = this.lerTexto("CPF do cliente: ");

        console.log(
            "Atenção: as contas do cliente NÃO serão apagadas; elas ficarão sem titular."
        );

        if (!this.confirmar(`Confirma a exclusão do cliente de CPF ${cpf}?`)) {
            console.log("Operação cancelada.");
            return;
        }

        if (this.banco.excluirCliente(cpf)) {
            console.log(
                "Cliente excluído. As contas dele ficaram sem titular e podem ser reatribuídas."
            );
        }
    }

    private listarContasCliente(): void {
        console.log("\n--- Listar contas do cliente ---");

        const cpf = this.lerTexto("CPF do cliente: ");
        const cliente = this.banco.consultarCliente(cpf);

        if (!cliente) {
            console.log("Cliente não encontrado.");
            return;
        }

        const contas = this.banco.listarContasCliente(cpf);

        if (contas.length === 0) {
            console.log(`O cliente ${cliente.nome} não possui contas.`);
            return;
        }

        console.log(`Contas de ${cliente.nome} (${contas.length}):`);

        for (const conta of contas) {
            console.log(` - ${conta.numero} (id ${conta.id}) - saldo R$ ${conta.saldo.toFixed(2)}`);
        }
    }

    private totalizarSaldoCliente(): void {
        console.log("\n--- Totalizar saldo do cliente ---");

        const cpf = this.lerTexto("CPF do cliente: ");
        const cliente = this.banco.consultarCliente(cpf);

        if (!cliente) {
            console.log("Cliente não encontrado.");
            return;
        }

        const total = this.banco.totalizarSaldoCliente(cpf);
        console.log(`Saldo total de ${cliente.nome}: R$ ${total.toFixed(2)}`);
    }
}

// Instancia a aplicação, faz a carga inicial e abre o menu (questão 6).
// O teste com require.main evita iniciar o menu caso App seja importada
// por outro arquivo (por exemplo, um teste automatizado).
if (require.main === module) {
    const app = new App();
    app.iniciar();
}
