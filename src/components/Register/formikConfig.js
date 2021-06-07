import * as Yup from 'yup';



export const defaultValues = {
  email: "",
  userName: "",
  password: "",
  verifyPassword: "",
};

// shape = the entered values must follow the requirements listed in the shape
// form validaiton using yup
export const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string()
    .required('Required')
    .min(8, 'Must be at least 8 characters'),
  verifyPassword: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  userName: Yup.string()
    .required('Required')
    .matches(/^\S*$/, 'No spaces')
    .min(3, 'Must be at least 3 characters'),
});
