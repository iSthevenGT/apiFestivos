function calcularDomingoRamos(year) {
    const a = year % 19;
    const b = year % 4;
    const c = year % 7;
    const d = (19 * a + 24) % 30;
    const dias = d + (2 * b + 4 * c + 6 * d + 5) % 7;
    let mes = 3
    let dia = 15 + dias
    if (dia > 31){
        dia = dia- 31
        mes =  4
    }
    return new Date(year,mes-1,dia)
}
console.log(calcularDomingoRamos(2024))

function agregarDias(fecha,dias){
    const fechat=new Date(fecha)
    fechat.setDate(fechat.getDate()+dias)
    return fechat
}

function siguienteLunes(fecha){
    let fechat=new Date(fecha)
    const diaSemana=fechat.getDay()
    if(diaSemana!=1){
        return fechat=agregarDias(fechat,8-diaSemana )
    }
    return fechat
}

let fecha=new Date(2024,8,18)
console.log(siguienteLunes(fecha))