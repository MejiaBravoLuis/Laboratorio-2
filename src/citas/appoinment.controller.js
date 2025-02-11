import { response } from "express";
import Appoinment from "../citas/appoinment.model.js";
import Pet from "../pet/pet.model.js"
import { validarJWT } from "../middlewares/validar-jwt.js";
import { check } from "express-validator";
import { existeCitaById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";

export const listAppointments = async (req, res) => {
    
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };

    try {
        const appoinments = await Appoinment.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        const appoinmentVets = await Promise.all(appoinments.map(async (appoinment) => {
            const veterinary = await Pet.findById(appoinment.petCited);
            
            return {
                ...appoinment.toObject(),
                petCited: veterinary ? veterinary : "La cita no existe"
            }
        }));
        
        const total = await Appoinment.countDocuments(query);
        res.status(200).json({
            succes: true,
            total,
            appoinments: appoinmentVets
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al listar citas',
            error
        })
    }
}

export const addAppointment = async (req, res) => {
    try {
        
        const data = req.body;
        const pet = await Pet.findOne({ _id: data.id });

        if(!pet){
            res.status(404).json({
                succes: false,
                message: 'La mascota no se encontró',
                error
            })
        }

        const appointment = new Appoinment({
            ...data,
            petCited: pet._id
        });

        await appointment.save();

        res.status(200).json({
            succes: true,
            appointment
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al agregar la cita',
            error
        })
    }
}

export const defuseAppointment = async (req, res) => {
    
    const { id } = req.params;

    try {
        
        await Appoinment.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            succes: true,
            message: 'Cita desactivada con éxito'
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al eliminar la cita',
            error
        })
    }
}

export const updateAppointment = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { ...data } = req.body;

        const appointment = await Appoinment.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            succes: true,
            msg: 'Cita actualizada éxitosamente',
            appointment
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al actualizar la cita',
            error
        })
    }
}

export const searchAppointment = async (req, res) => {
    const { id } = req.params;

    try {
        
        const appointment = await Appoinment.findById(id);

        if(!appointment){
            return res.status(404).json({
                success: false,
                message: 'Cita no encontrada'
            })
        }

        const owner = await Pet.findById(appointment.petRegistered);

        res.status(200).json({
            success: true,
            appointment: {
                ...appointment.toObject(),
            }
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar cita',
            error
        })
    }
}