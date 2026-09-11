function nomeTratamento(nome: string,
pronome_tratamento : string = "Sr."): string {
return pronome_tratamento + " " + nome;
}
console.log(nomeTratamento('Ely', 'Dr.'));
console.log(nomeTratamento('Ely'));
console.log(nomeTratamento('Sávia', 'Sra.'));