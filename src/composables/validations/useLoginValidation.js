import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('El correo es obligatorio')
    .email('El formato del correo no es válido'),
    
  password: yup
    .string()
    .required('La contraseña es obligatoria')
})