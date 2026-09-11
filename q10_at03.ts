class Autenticacao {
  private usuario: string;
  private senha: string;

  public constructor(usuario: string, senha: string) {
    this.usuario = usuario;
    this.senha = senha;
  }

  public validar( ): boolean {
    if (this.usuario === "admin" && this.senha === "1234") {
        return true
    } else {
        return false
    }
  }
}

let usuario_1: Autenticacao = new Autenticacao("admin", "1234")

if (usuario_1.validar()){
    console.log("Usuário validado!!!")
} else {
    console.log("Usuário inválido!!!")
}