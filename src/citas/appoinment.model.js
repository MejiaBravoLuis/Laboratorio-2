import { Schema , model} from "mongoose";

const AppointmentSchema  = new Schema({

    veterinary: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    hour: {
        type: String,
        required: true
    },
    petCited: {
        type: Schema.Types.ObjectId,
        ref: 'pet',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }

},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model ('Appoinment', AppointmentSchema  )