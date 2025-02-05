import User from '../users/user.model.js'
import Pet from '../pet/pet.model.js'

export const savePet = async (req, res) => {
    try {
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