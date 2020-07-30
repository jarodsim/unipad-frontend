/**
 * Formata para String e adiciona mais um (1) dia para select de data do material-ui
 */

let data = new Date()
let hora = data.getHours().toString()
let minutos = data.getMinutes().toString()
let ano = data.getFullYear().toString()
let mes = data.getMonth() + 1
let dia = data.getDate() + 1
dia = dia.toString()
let dataFormatada = '2017-05-24T10:30'

if (mes >= 10) {
    mes = mes.toString()
    dataFormatada = (ano + '-' + mes + '-' + dia + 'T' + hora + ':' + minutos).toString()
} else {
    mes = mes.toString()
    dataFormatada = (ano + '-0' + mes + '-' + dia + 'T' + hora + ':' + minutos).toString()
}


export default dataFormatada