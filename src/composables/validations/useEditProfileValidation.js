import * as yup from 'yup'

export const editProfileSchema = yup.object({
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
    .matches(/^[0-9]{10}$/, 'El número de teléfono debe tener 10 dígitos'),

  password: yup
    .string()
    .required('Debes ingresar tu contraseña actual'),

  newPassword: yup
    .string()
    .nullable()
    .transform(value => (value === '' ? null : value))
    .notRequired()
    .test(
      'min-if-present',
      'La nueva contraseña debe tener al menos 6 caracteres',
      value => !value || value.length >= 6
    ),

  confirmPassword: yup
    .string()
    .nullable()
    .transform(value => (value === '' ? null : value))
    .when('newPassword', {
      is: val => val != null && val.length > 0,
      then: schema =>
        schema
          .required('Debes confirmar tu nueva contraseña')
          .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden'),
      otherwise: schema => schema.notRequired()
    })
})