export function useGetFormatedDate() {
  let data = new Date()
  let hora = data.getHours()
  let minutos = data.getMinutes()
  let ano = data.getFullYear()
  let mes = data.getMonth() + 1
  let dia = data.getDate()
  let dataFormatada = '2017-05-24T10:30'

  if (hora <= 9) {
    hora = '0' + hora
  }

  if (dia >= 32) {
    dia = '01'
    mes = mes + 1
  }

  if (dia <= 9) {
    dia = '0' + dia
  }

  if (mes >= 10) {
    if (minutos <= 9) {
      dataFormatada = (
        ano +
        '-' +
        mes +
        '-' +
        dia +
        'T' +
        hora +
        ':0' +
        minutos
      ).toString()
    } else {
      dataFormatada = (
        ano +
        '-' +
        mes +
        '-' +
        dia +
        'T' +
        hora +
        ':' +
        minutos
      ).toString()
    }
  } else {
    if (minutos <= 9) {
      dataFormatada = (
        ano +
        '-0' +
        mes +
        '-' +
        dia +
        'T' +
        hora +
        ':0' +
        minutos
      ).toString()
    } else {
      dataFormatada = (
        ano +
        '-0' +
        mes +
        '-' +
        dia +
        'T' +
        hora +
        ':' +
        minutos
      ).toString()
    }
  }

  return dataFormatada
}
