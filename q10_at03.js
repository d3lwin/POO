"use strict";
class Autenticacao {
    usuario;
    senha;
    constructor(usuario, senha) {
        this.usuario = usuario;
        this.senha = senha;
    }
    validar() {
        if (this.usuario === "admin" && this.senha === "1234") {
            return true;
        }
        else {
            return false;
        }
    }
}
let usuario_1 = new Autenticacao("admin", "1234");
if (usuario_1.validar()) {
    console.log("Usuário validado!!!");
}
else {
    console.log("Usuário inválido!!!");
}
