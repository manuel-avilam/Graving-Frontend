import * as yup from 'yup'

export const visitSchema = yup.object({
  visitDate: yup
    .string()
    .required('La fecha es obligatoria'),

  visitTime: yup
    .string()
    .required('La hora es obligatoria'),

  dateTime: yup
    .string()
    .test('is-today-or-future', 'No puedes registrar una visita con una fecha y hora que ya han pasado.', function () {
      const { visitDate, visitTime } = this.parent

      if (!visitDate || !visitTime) return true

      const now = new Date()
      const selectedDateTime = new Date(`${visitDate}T${visitTime}`)

      return selectedDateTime >= now
    })
})