import { Schema, model, Document, Types, Model } from 'mongoose';

export interface IAnalysis extends Document {
  userId: string;
  patientId: Types.ObjectId;
  examTechnique: string;
  sample: string;
  reagents: string;
  reagentValidity: Date;
  batch: string;
  result: string;
  observations: string;
}

// Define o esquema da análise
const analysisSchema = new Schema<IAnalysis>({
  userId: { type: String, required: true },
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  examTechnique: { type: String, required: true },
  sample: { type: String, required: true },
  reagents: { type: String, required: true },
  reagentValidity: { type: Date, required: true },
  batch: { type: String, required: true },
  result: { type: String, required: true },
  observations: { type: String, required: true },
});

// Cria o modelo com base no esquema
const AnalysisModel: Model<IAnalysis> = model<IAnalysis>('Analysis', analysisSchema);

// Exporta o modelo
export default AnalysisModel;
