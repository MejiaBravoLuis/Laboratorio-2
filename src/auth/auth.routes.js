import { Router } from 'express';
import { check } from 'express-validator';
import { login, register } from './auth.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { existenteEmail, esRoleValido } from '../helpers/db-validator.js';

const router = Router();

router.post(
    '/login',
    [
        check('correo', 'Este no es un correo valido').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    login
);

router.post(
    '/register',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser mayor a 6 caracteres').isLength({min: 6}),
        check('correo', 'Este no es un correo valido').isEmail(),
        check('correo').custom(existenteEmail),
        check('role').custom(esRoleValido),
        check('phone', 'El teléfono debe ser de 8 números').isLength({ min: 8, max: 8 }),
        validarCampos,
    ],
    register
);

export default router;