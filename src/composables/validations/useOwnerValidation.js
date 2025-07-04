import * as yup from 'yup'

export const ownerSchema = yup.object({
  name: yup
    .string()
    .required('El nombre del responsable es obligatorio'),

  phone: yup
    .string()
    .required('El teléfono del responsable es obligatorio')
    .matches(/^[0-9]{10}$/, 'Debe tener 10 dígitos'),

  email: yup
    .string()
    .required('El correo del responsable es obligatorio')
    .email('Formato de correo inválido'),

  curp: yup
    .string()
    .required('El CURP del responsable es obligatorio')
    .length(18, 'El CURP debe tener exactamente 18 caracteres')
})