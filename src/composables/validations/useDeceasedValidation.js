import * as yup from 'yup'

export const deceasedSchema = yup.object({
  name: yup
    .string()
    .required('El nombre del difunto es obligatorio')
    .min(3, 'Debe tener al menos 3 caracteres'),

  epitaph: yup
    .string()
    .required('El epitafio es obligatorio'),

  birthDate: yup
    .string()
    .required('La fecha de nacimiento es obligatoria'),

  deathDate: yup
    .string()
    .required('La fecha de defunción es obligatoria')
    .test('not-in-future', 'La fecha de defunción no puede ser futura', function (value) {
      if (!value) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return new Date(value) <= today
    })
    .test('after-birth', 'La fecha de defunción debe ser posterior a la de nacimiento', function (value) {
      const { birthDate } = this.parent
      if (!value || !birthDate) return false
      return new Date(value) > new Date(birthDate)
    }),
    
    graveId: yup
    .number()
    .typeError('Debes seleccionar una tumba')
    .required('Debes seleccionar una tumba')
})