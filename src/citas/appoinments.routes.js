import { Router } from "express";
import { check } from "express-validator";
import { addAppointment, defuseAppointment, listAppointments, searchAppointment, updateAppointment } from "./appoinment.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js"
import { existeCitaById } from "../helpers/db-validator.js";

const router = Router();

router.get("/", listAppointments);

export default router;

router.post(
    "/",
    [
        validarJWT,
        check('id', 'El id de la mascota es requerido').not().isEmpty(),
        validarCampos
    ],
    addAppointment
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un id válido").isMongoId(),
        check("id").custom(existeCitaById),
        validarCampos
    ],
    defuseAppointment
)

router.put(
    "/:id",
    [
        check("id", "No es un id válido").isMongoId(),
        check("id").custom(existeCitaById),
        validarCampos
    ],
    updateAppointment
)

router.get(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCitaById),
        validarCampos
    ],
    searchAppointment
)
