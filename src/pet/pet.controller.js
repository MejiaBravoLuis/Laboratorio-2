import User from '../users/user.model.js'
import Pet from '../pet/pet.model.js'
import { response } from 'express';

export const savePet = async (req, res) => {
    try {
        console.log('hola')
        const data = req.body;
        const user = await User.findOne({ email: data.email });

        if(!user){
            return res.status(404).json({
                succes: false,
                message: 'Propietario no encontrado'
            })
        }

        const pet = new Pet({
            ...data,
            keeper: user._id
        });

        await pet.save();

        res.status(200).json({
            succes: true,
            pet
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al guardar mascota',
            error
        })
    }
}

export const getPets = async (req, res) => {
   
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };
 
    try {
        const pets = await Pet.find(query)
            .skip(Number(desde))
            .limit(Number(limite));
           
        const petsWithOwnerNames = await Promise.all(pets.map(async (pet) =>{
            const owner = await User.findById(pet.keeper);
            return{
                ...pet.toObject(),
                keeper: owner ? owner.nombre : "Propietario no encontrado"
            }
        }));
 
        const total = await Pet.countDocuments(query);
 
        res.status(200).json({
            succes: true,
            total,
            pets: petsWithOwnerNames
        })
 
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: 'Error al obtener mascotas',
            error
        })
    }
 
}
 
export const searchPet = async (req, res) => {
    const { id } = req.params;
 
    try {
        const pet = await Pet.findById(id);
        if(!pet){
            return res.status(404).json({
                succes: false,
                message: 'Mascota no encontrada'
            })
        }
 
        const owner = await User.findById(pet.keeper)
 
        res.status(200).json({
            succes: true,
            pet: {
                ...pet.toObject(),
                keeper: owner ? owner.nombre : "Propietario no encontrado"
            }
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: 'Error al buscar mascota',
            error
        })
    }
}


export const deletePet = async (req, res) => {
    
    const { id } = req.params;

    try {
    
        await Pet.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            succes: true,
            message: 'Pet eliminada exitosamente',
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: 'Error al eliminar mascota',
            error
        })
    }
}


export const updatePet = async (req, res = response) => {
    try {

        const { id } = req.params;
        const { _id, keeper, ...data } = req.body;
        
        const pet = await Pet.findByIdAndUpdate(id, data, {new : true});

        res.status(200).json({
            succes: true,
            msg: 'Mascota actualizada con éxito!!!',
            pet
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al actualizar la mascota',
            error
        })
    }
}