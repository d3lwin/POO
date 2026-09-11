"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function nomeTratamento(nome, pronome_tratamento = "Sr.") {
    return pronome_tratamento + " " + nome;
}
console.log(nomeTratamento('Ely', 'Dr.'));
console.log(nomeTratamento('Ely'));
console.log(nomeTratamento('Sávia', 'Sra.'));
//# sourceMappingURL=q1_at03.js.map