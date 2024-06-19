import { Schema, model, Document } from 'mongoose';

export interface IPatient extends Document {
  userId: string; // Certifique-se de que este campo está presente
  name: string;
  email: string;
  cpf: string;
  ordem:string;
}

const patientSchema = new Schema<IPatient>({
  userId: { type: String, required: true }, // Certifique-se de que este campo está presente
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cpf: { type: String, required: true, unique: true },
  ordem: {type: String, required: true, unique: true}
});

const PatientModel = model<IPatient>('Patient', patientSchema);

export default PatientModel;
