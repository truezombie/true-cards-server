import mongoose from 'mongoose';

interface InterfaceProgress extends mongoose.Document {
  cardSetId: string;
  cardId: string;
  userId: string;
  timeAdded: number;
  timeLastSuccess: number;
  timesSuccess: number;
}

const SchemaProgress: mongoose.Schema = new mongoose.Schema<InterfaceProgress>({
  cardSetId: String,
  cardId: String,
  userId: String,
  timeAdded: Number,
  timeLastSuccess: Number,
  timesSuccess: Number,
});

const ModelSchemaCard = mongoose.model<InterfaceProgress>('Progress', SchemaProgress);

export { ModelSchemaCard, SchemaProgress, InterfaceProgress };
