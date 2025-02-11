import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser, deleteUser, updatePassword } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { uploadProfilePicture } from "../middlewares/multer-upload.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
 
const router = Router();
 
router.get("/", getUsers);
 
router.get(
    "/findUser/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
)
 
router.put(
    "/:id",
    uploadProfilePicture.single('profilePicture'),
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
)

router.put(
    "/:id/password",
    [
        validarJWT, // El usuario debe estar autenticado
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        check("password", "La nueva contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
        validarCampos
    ],
    updatePassword
);
   
router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
)
 
 
export default router;