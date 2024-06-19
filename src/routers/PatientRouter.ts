import express from 'express';
import { createPatient, getPatients, getPatientById, updatePatient, deletePatient } from '../controllers/PatientController';
import auth from '../middleware/auth';

const PatientRouter = express.Router();

PatientRouter.post('/patients', auth, createPatient);  // Rota para criar um novo paciente
PatientRouter.get('/GetPatients', auth, getPatients);  // Rota para obter todos os pacientes
PatientRouter.get('/GetOnePatients/:id', auth, getPatientById);  // Rota para obter um paciente específico
PatientRouter.put('/cpatients/:id', auth, updatePatient);  // Rota para atualizar um paciente
PatientRouter.delete('/deletarPatients/:id', auth, deletePatient);  // Rota para excluir um paciente

export default PatientRouter;
