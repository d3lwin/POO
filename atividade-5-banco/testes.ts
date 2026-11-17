/**
 * testes.ts
 * ---------------------------------------------------------------------------
 * Questão 5 da parte 1: testes de todos os métodos da classe Banco.
 *
 * Os testes usam uma instância nova do Banco em cada caso para que as
 * alterações de um teste não afetem os demais. As mensagens de erro esperadas
 * do Banco são silenciadas; no fim é exibido o resumo dos testes.
 *
 * Execute com:
 *   npm test
 * ou:
 *   npx tsc && node dist/testes.js
 */

import assert from "node:assert/strict";
import { Banco, Cliente, Conta } from "./banco";

let totalTestes = 0;
let totalFalhas = 0;

/** Executa um teste, silenciando as mensagens esperadas do Banco. */
function teste(nome: string, fn: () => void): void {
    const logOriginal = console.log;
    console.log = () => {
        /* silencia mensagens de erro esperadas */
    };

    let erro: unknown = null;

    try {
        fn();
    } catch (e) {
        erro = e;
    } finally {
        console.log = logOriginal;
    }

    totalTestes++;

    if (erro) {
        totalFalhas++;
        const mensagem = erro instanceof Error ? erro.message : String(erro);
        console.error(`FALHOU - ${nome}\n         ${mensagem}`);
    } else {
        console.log(`OK     - ${nome}`);
    }
}

/** Cria um Banco novo já com a carga inicial. */
function novoBanco(): Banco {
    const banco = new Banco();
    banco.carregarDados();
    return banco;
}

// ===========================================================================
// Carga inicial e consultas básicas
// ===========================================================================

teste("carregarDados cria 5 clientes, 5 contas e as associações", () => {
    const banco = novoBanco();

    assert.equal(banco.clientes.length, 5);
    assert.equal(banco.contas.length, 5);

    assert.equal(banco.consultarCliente("111.111.111-11")?.nome, "João Silva");
    assert.equal(banco.consultarPorNumero("0001-1")?.cliente?.cpf, "111.111.111-11");
    assert.equal(banco.consultarPorNumero("0005-5")?.cliente?.cpf, "444.444.444-44");
    assert.equal(banco.consultarCliente("555.555.555-55")?.contas.length, 0); // Carlos
});

teste("proximoIdConta e proximoIdCliente geram ids livres", () => {
    const banco = novoBanco();

    assert.equal(banco.proximoIdConta(), 106);
    assert.equal(banco.proximoIdCliente(), 6);
});

teste("consultarCliente retorna o cliente ou null", () => {
    const banco = novoBanco();

    assert.equal(banco.consultarCliente("222.222.222-22")?.id, 2);
    assert.equal(banco.consultarCliente("999.999.999-99"), null);
});

teste("consultar e consultarPorNumero encontram a conta", () => {
    const banco = novoBanco();

    assert.equal(banco.consultar(101)?.numero, "0001-1");
    assert.equal(banco.consultar(999), null);
    assert.equal(banco.consultarPorNumero("0003-3")?.id, 103);
    assert.equal(banco.consultarPorNumero("9999-9"), null);
});

// ===========================================================================
// Inclusão e regras de duplicidade
// ===========================================================================

teste("inserirCliente impede id duplicado", () => {
    const banco = novoBanco();

    const repetido = new Cliente(1, "Outro João", "999.999.999-99", new Date(2000, 0, 1));

    assert.equal(banco.inserirCliente(repetido), false);
    assert.equal(banco.clientes.length, 5);
});

teste("inserirCliente impede CPF duplicado", () => {
    const banco = novoBanco();

    const repetido = new Cliente(6, "Outro João", "111.111.111-11", new Date(2000, 0, 1));

    assert.equal(banco.inserirCliente(repetido), false);
    assert.equal(banco.clientes.length, 5);
});

teste("inserirCliente aceita cliente com id e CPF novos", () => {
    const banco = novoBanco();

    const novo = new Cliente(6, "Novo Cliente", "666.666.666-66", new Date(2000, 0, 1));

    assert.equal(banco.inserirCliente(novo), true);
    assert.equal(banco.clientes.length, 6);
    assert.equal(banco.consultarCliente("666.666.666-66")?.id, 6);
});

teste("inserirConta impede id duplicado", () => {
    const banco = novoBanco();

    assert.equal(banco.inserirConta(new Conta(101, "0099-9", 10)), false);
    assert.equal(banco.contas.length, 5);
});

teste("inserirConta impede número duplicado", () => {
    const banco = novoBanco();

    assert.equal(banco.inserirConta(new Conta(199, "0001-1", 10)), false);
    assert.equal(banco.contas.length, 5);
});

teste("inserirConta aceita id e número novos", () => {
    const banco = novoBanco();

    assert.equal(banco.inserirConta(new Conta(199, "0099-9", 10)), true);
    assert.equal(banco.contas.length, 6);
    assert.equal(banco.consultar(199)?.numero, "0099-9");
});

// ===========================================================================
// Associação conta <-> cliente
// ===========================================================================

teste("associarContaCliente associa nos dois sentidos", () => {
    const banco = novoBanco();

    assert.equal(banco.inserirConta(new Conta(106, "0006-6", 400)), true);
    assert.equal(banco.associarContaCliente("0006-6", "222.222.222-22"), true);

    assert.equal(banco.consultarPorNumero("0006-6")?.cliente?.cpf, "222.222.222-22");
    assert.equal(banco.listarContasCliente("222.222.222-22").length, 2);
});

teste("associarContaCliente rejeita associação repetida", () => {
    const banco = novoBanco();

    assert.equal(banco.associarContaCliente("0003-3", "222.222.222-22"), false);
    assert.equal(banco.listarContasCliente("222.222.222-22").length, 1);
});

teste("associarContaCliente rejeita conta que já tem outro titular", () => {
    const banco = novoBanco();

    assert.equal(banco.associarContaCliente("0001-1", "222.222.222-22"), false);
    assert.equal(banco.consultarPorNumero("0001-1")?.cliente?.cpf, "111.111.111-11");
});

teste("associarContaCliente rejeita cliente ou conta inexistente", () => {
    const banco = novoBanco();

    assert.equal(banco.associarContaCliente("0001-1", "999.999.999-99"), false);
    assert.equal(banco.associarContaCliente("9999-9", "111.111.111-11"), false);
});

teste("listarContasCliente devolve as contas do cliente", () => {
    const banco = novoBanco();

    assert.equal(banco.listarContasCliente("111.111.111-11").length, 2);
    assert.equal(banco.listarContasCliente("222.222.222-22").length, 1);
    assert.equal(banco.listarContasCliente("999.999.999-99").length, 0);
});

teste("totalizarSaldoCliente soma todas as contas do cliente", () => {
    const banco = novoBanco();

    assert.equal(banco.totalizarSaldoCliente("111.111.111-11"), 3500); // 1000 + 2500
    assert.equal(banco.totalizarSaldoCliente("222.222.222-22"), 750);
    assert.equal(banco.totalizarSaldoCliente("555.555.555-55"), 0); // Carlos não tem contas
    assert.equal(banco.totalizarSaldoCliente("999.999.999-99"), 0);
});

// ===========================================================================
// Operações de saldo
// ===========================================================================

teste("depositar valida valor e conta", () => {
    const banco = novoBanco();

    assert.equal(banco.depositar("0001-1", 500), true);
    assert.equal(banco.consultarPorNumero("0001-1")?.saldo, 1500);

    assert.equal(banco.depositar("0001-1", 0), false);
    assert.equal(banco.depositar("0001-1", -10), false);
    assert.equal(banco.depositar("9999-9", 10), false);
    assert.equal(banco.consultarPorNumero("0001-1")?.saldo, 1500);
});

teste("sacar valida valor, saldo e conta", () => {
    const banco = novoBanco();

    assert.equal(banco.sacar("0001-1", 200), true);
    assert.equal(banco.consultarPorNumero("0001-1")?.saldo, 800);

    assert.equal(banco.sacar("0001-1", 999999), false); // saldo insuficiente
    assert.equal(banco.sacar("0001-1", 0), false);
    assert.equal(banco.sacar("0001-1", -50), false);
    assert.equal(banco.sacar("9999-9", 10), false);
    assert.equal(banco.consultarPorNumero("0001-1")?.saldo, 800);
});

teste("transferir movimenta as duas contas e valida os casos de erro", () => {
    const banco = novoBanco();

    assert.equal(banco.transferir("0001-1", "0002-2", 300), true);
    assert.equal(banco.consultarPorNumero("0001-1")?.saldo, 700);
    assert.equal(banco.consultarPorNumero("0002-2")?.saldo, 2800);

    assert.equal(banco.transferir("0001-1", "0001-1", 10), false); // mesma conta
    assert.equal(banco.transferir("0001-1", "9999-9", 10), false); // destino inexistente
    assert.equal(banco.transferir("9999-9", "0001-1", 10), false); // origem inexistente
    assert.equal(banco.transferir("0001-1", "0002-2", 999999), false); // sem saldo
    assert.equal(banco.consultarPorNumero("0001-1")?.saldo, 700);
});

teste("atualizar altera o saldo e rejeita valor negativo", () => {
    const banco = novoBanco();

    assert.equal(banco.atualizar("0001-1", 1234.56), true);
    assert.equal(banco.consultarPorNumero("0001-1")?.saldo, 1234.56);

    assert.equal(banco.atualizar("0001-1", -1), false);
    assert.equal(banco.consultarPorNumero("0001-1")?.saldo, 1234.56);

    assert.equal(banco.atualizar("9999-9", 10), false);
});

teste("transferirParaVarias realiza uma ordem bancária", () => {
    const banco = novoBanco();

    assert.equal(banco.transferirParaVarias("0005-5", ["0001-1", "0002-2"], 100), 2);
    assert.equal(banco.consultarPorNumero("0005-5")?.saldo, 4800);
    assert.equal(banco.consultarPorNumero("0001-1")?.saldo, 1100);
    assert.equal(banco.consultarPorNumero("0002-2")?.saldo, 2600);

    // Uma conta inexistente e uma válida: apenas a válida é transferida.
    assert.equal(banco.transferirParaVarias("0001-1", ["9999-9", "0003-3"], 100), 1);
    assert.equal(banco.consultarPorNumero("0001-1")?.saldo, 1000);
    assert.equal(banco.consultarPorNumero("0003-3")?.saldo, 850);
});

teste("relatórios: quantidade, total e média", () => {
    const banco = novoBanco();

    assert.equal(banco.quantidadeContas(), 5);
    assert.equal(banco.totalDinheiro(), 9550); // 1000+2500+750+300+5000
    assert.equal(banco.mediaSaldo(), 1910); // 9550 / 5
});

// ===========================================================================
// Titularidade e exclusões
// ===========================================================================

teste("mudarTitularidade troca o dono nos dois arrays", () => {
    const banco = novoBanco();

    assert.equal(banco.mudarTitularidade("0001-1", "222.222.222-22"), true);
    assert.equal(banco.consultarPorNumero("0001-1")?.cliente?.cpf, "222.222.222-22");
    assert.equal(banco.listarContasCliente("111.111.111-11").length, 1);
    assert.equal(banco.listarContasCliente("222.222.222-22").length, 2);

    // Mesmo titular novamente / conta ou cliente inexistente.
    assert.equal(banco.mudarTitularidade("0001-1", "222.222.222-22"), false);
    assert.equal(banco.mudarTitularidade("9999-9", "222.222.222-22"), false);
    assert.equal(banco.mudarTitularidade("0001-1", "999.999.999-99"), false);
});

teste("excluirCliente mantém as contas, mas sem titular", () => {
    const banco = novoBanco();

    assert.equal(banco.excluirCliente("222.222.222-22"), true);
    assert.equal(banco.consultarCliente("222.222.222-22"), null);
    assert.equal(banco.contas.length, 5); // a conta continua no banco
    assert.equal(banco.consultarPorNumero("0003-3")?.cliente, null);
    assert.equal(banco.listarContasSemCliente().length, 1);

    assert.equal(banco.excluirCliente("999.999.999-99"), false);
});

teste("excluirConta remove a conta e a retira do cliente", () => {
    const banco = novoBanco();

    assert.equal(banco.excluirConta("0003-3"), true);
    assert.equal(banco.consultarPorNumero("0003-3"), null);
    assert.equal(banco.contas.length, 4);
    assert.equal(banco.consultarCliente("222.222.222-22")?.contas.length, 0);
    assert.equal(banco.excluirConta("0003-3"), false);
});

teste("excluir é um alias de excluirConta", () => {
    const banco = novoBanco();

    assert.equal(banco.excluir("0004-4"), true);
    assert.equal(banco.consultarPorNumero("0004-4"), null);
});

teste("listarContasSemCliente e atribuirTitularidade trabalham juntos", () => {
    const banco = novoBanco();

    // Maria é excluída; sua conta 0003-3 fica sem titular.
    assert.equal(banco.excluirCliente("222.222.222-22"), true);

    const semTitular = banco.listarContasSemCliente();
    assert.equal(semTitular.length, 1);
    assert.equal(semTitular[0]?.numero, "0003-3");

    // Carlos (sem contas) recebe a conta órfã.
    assert.equal(banco.atribuirTitularidade("0003-3", "555.555.555-55"), true);
    assert.equal(banco.consultarPorNumero("0003-3")?.cliente?.cpf, "555.555.555-55");
    assert.equal(banco.listarContasCliente("555.555.555-55").length, 1);
    assert.equal(banco.listarContasSemCliente().length, 0);

    // A conta agora tem titular: não pode ser "atribuída" de novo.
    assert.equal(banco.atribuirTitularidade("0003-3", "444.444.444-44"), false);
    assert.equal(banco.atribuirTitularidade("9999-9", "444.444.444-44"), false);
});

// ===========================================================================
// Validações da própria Conta
// ===========================================================================

teste("Conta impede saldo inicial negativo e saque acima do saldo", () => {
    assert.throws(() => new Conta(1, "0001-1", -1), /saldo inicial/i);

    const conta = new Conta(2, "0002-2", 100);
    assert.equal(conta.sacar(200), false);
    assert.equal(conta.saldo, 100);
    assert.equal(conta.depositar(-50), false);
    assert.equal(conta.saldo, 100);
});

// ===========================================================================
// Resumo
// ===========================================================================

console.log(`\n${totalTestes - totalFalhas}/${totalTestes} testes passaram.`);

if (totalFalhas > 0) {
    process.exitCode = 1;
}
