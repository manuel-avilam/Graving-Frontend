import * as yup from 'yup'

export const repairSchema = yup.object({
  type: yup
    .string()
    .required('El tipo de reparación es obligatorio'),

  description: yup
    .string()
    .required('La descripción es obligatoria'),

  date: yup
    .string()
    .required('La fecha es obligatoria')
    .test('not-in-past', 'La fecha debe ser hoy o posterior', function (value) {
      if (!value) return false

      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      const todayStr = `${yyyy}-${mm}-${dd}`

      return value >= todayStr
    })
})