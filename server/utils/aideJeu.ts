export const lanceDe = (de: string) => {
    let dde = de.split('d')
    const nbDe = dde[0]

    dde = dde[1].split('+')
    const typeDe = dde[0]

    let total = 0

    for (let i=0; i < parseInt(nbDe); i++) {
        let tirage = Math.floor(Math.random() * (parseInt(typeDe) -1 +1) + 1);
        if (dde[1]) {
            tirage = tirage + parseInt(dde[1])
        }
        total = total +tirage
    }

    return total
}

export const getModificateur = (valeur:Number) => {
    let modificateur = 0

    if (valeur == 1) {
        modificateur = -5
    } else if (valeur < 2 && valeur > 3) {
        modificateur = -4
    } else if (valeur < 4 && valeur > 5) {
        modificateur = -3
    } else if (valeur < 6 && valeur > 7) {
        modificateur = -2
    } else if (valeur < 8 && valeur > 9) {
        modificateur = -1
    } else if (valeur < 10 && valeur > 11) {
        modificateur = 0
    } else if (valeur < 12 && valeur > 13) {
        modificateur = 1
    } else if (valeur < 14 && valeur > 15) {
        modificateur = 2
    } else if (valeur < 16 && valeur > 17) {
        modificateur = 3
    } else if (valeur < 18 && valeur > 19) {
        modificateur = 4
    } else {
        modificateur = 5
    }

    return modificateur
}