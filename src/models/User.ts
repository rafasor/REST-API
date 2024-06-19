import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  RA: string; 
}

const userSchema = new Schema<IUser>({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  RA: { type: String, required: true, unique: true }, 
});


const UserModel = model<IUser>('User', userSchema);

export default UserModel;