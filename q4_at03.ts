function exibir(...strings : string[]) {
    for (let string of strings) {
        console.log(string)
    }
}

exibir("a", "b");
exibir("a", "b", "c");
exibir("a", "b", "c", "d");