import * as yup from 'yup'

export const registerSchema = yup.object({
  name: yup
    .string()
    .required('El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),

  email: yup
    .string()
    .required('El correo es obligatorio')
    .email('El formato del correo no es válido'),

  phoneNumber: yup
    .string()
    .required('El número de teléfono es obligatorio')
    .matches(/^[0-9]{10}$/, 'El número de teléfono debe ser de 10 dígitos'),

  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña')
})