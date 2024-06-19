import { Request, Response } from 'express';
import AnalysisModel, { IAnalysis } from '../models/Analysis';
import PatientModel from '../models/Patient';

// Código de cadastro de análise para o paciente

export const createAnalysisForPatient = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = (req as any).user._id; // ID do usuário autenticado
    const { patientId } = req.params; // Captura o patientId da URL

    const {
      examTechnique,
      sample,
      reagents,
      reagentValidity,
      batch,
      result,
      observations,
    } = req.body;

    console.log('Dados recebidos para criar análise:', req.body); // Log para depuração

    // Procurar o paciente usando userId e patientId
    const patient = await PatientModel.findOne({ userId, _id: patientId });

    if (!patient) {
      console.log('Patient not found for user:', userId); // Log para depuração
      return res.status(404).json({ message: 'Paciente não encontrado para este usuário.' });
    }

    const analysis = new AnalysisModel({
      userId,
      patientId,
      examTechnique,
      sample,
      reagents,
      reagentValidity,
      batch,
      result,
      observations,
    });

    const newAnalysis = await analysis.save();
    res.status(201).json({ message: 'Análise criada com sucesso', analysis: newAnalysis });
  } catch (error) {
    console.error('Erro ao criar análise para paciente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};




export const getAnalysesByPatientId = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { patientId } = req.params;

    // Fetch analyses associated with the specified patient
    const analyses = await AnalysisModel.find({ patientId });

    res.status(200).json(analyses);
  } catch (error) {
    console.error('Error fetching analyses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAnalysisById = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = (req as any).user._id;  // ID do usuário autenticado
    const { id } = req.params;
    const analysis = await AnalysisModel.findOne({ _id: id, userId });
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAnalysis = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = (req as any).user._id;  // ID do usuário autenticado
    const { id } = req.params;
    const {
      examTechnique,
      sample,
      reagents,
      reagentValidity,
      batch,
      result,
      observations,
      resultComparison
    } = req.body;

    const updatedAnalysis = await AnalysisModel.findOneAndUpdate(
      { _id: id, userId },
      {
        examTechnique,
        sample,
        reagents,
        reagentValidity,
        batch,
        result,
        observations,
        resultComparison
      },
      { new: true }
    );
    if (!updatedAnalysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    res.status(200).json({ message: 'Analysis updated successfully', analysis: updatedAnalysis });
  } catch (error) {
    console.error('Error updating analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAnalysis = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = (req as any).user._id;  // ID do usuário autenticado
    const { id } = req.params;

    const deletedAnalysis = await AnalysisModel.findOneAndDelete({ _id: id, userId });
    if (!deletedAnalysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    res.status(200).json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Error deleting analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};