import express from 'express';
import { createAnalysisForPatient, getAnalysisById, updateAnalysis, deleteAnalysis, getAnalysesByPatientId } from '../controllers/AnalysisController';
import auth from '../middleware/auth';

const AnalysisRouter = express.Router();

AnalysisRouter.post('/analyses/:patientId', auth, createAnalysisForPatient);  // Rota para criar uma nova análise
AnalysisRouter.get('/GetAnalyses/:patientId', auth, getAnalysesByPatientId);  // Rota para obter as análises do usuário autenticado
AnalysisRouter.get('/analyses/:id', auth, getAnalysisById);  // Rota para buscar uma análise específica
AnalysisRouter.put('/analyses/:id', auth, updateAnalysis);  // Rota para atualizar uma análise específica
AnalysisRouter.delete('/analyses/:id', auth, deleteAnalysis);  // Rota para excluir uma análise específica

export default AnalysisRouter;
