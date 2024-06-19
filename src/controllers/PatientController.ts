import { Request, Response } from 'express';
import PatientModel, { IPatient } from '../models/Patient';



const generateRandomOrder = (): string => {
  const randomNumber = Math.floor(Math.random() * 10000); // Gera um número aleatório entre 0 e 9999
  return randomNumber.toString().padStart(4, '0'); // Garante que o número tenha até 4 dígitos, preenchendo com zeros à esquerda se necessário
};

export const createPatient = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = (req as any).user._id;  // ID do usuário autenticado
    const { name, email, cpf } = req.body;

    // Gerar uma ordem aleatória de até 4 dígitos
    const ordem = generateRandomOrder();

    // Verificar se já existe um paciente com a mesma ordem para este usuário
    const existingPatient = await PatientModel.findOne({ userId, ordem });
    if (existingPatient) {
      return res.status(400).json({ message: 'Já existe um paciente com esta ordem para este usuário.' });
    }

    const patient: IPatient = new PatientModel({ userId, name, email, cpf, ordem });
    const newPatient = await patient.save();
    return res.status(201).json({ message: 'Patient created successfully', patient: newPatient });
  } catch (error: any) {
    console.error('Error creating patient:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const getPatients = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = (req as any).user._id;  // ID do usuário autenticado
    const patients = await PatientModel.find({ userId });
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = (req as any).user._id;  // ID do usuário autenticado
    const { id } = req.params;
    const patient = await PatientModel.findOne({ _id: id, userId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = (req as any).user._id;  // ID do usuário autenticado
    const { id } = req.params;
    const { name, email, cpf } = req.body;

    const updatedPatient = await PatientModel.findOneAndUpdate(
      { _id: id, userId },
      { name, email, cpf },
      { new: true }
    );
    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({ message: 'Patient updated successfully', patient: updatedPatient });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = (req as any).user._id;  // ID do usuário autenticado
    const { id } = req.params;

    const deletedPatient = await PatientModel.findOneAndDelete({ _id: id, userId });
    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

