import { Document, Schema, model } from 'mongoose';

interface InterfaceProgress extends Document {
  cardSetId: string;
  cardId: string;
  userId: string;
  timeLastSuccess: number;
  timesSuccess: number;
}

const SchemaProgress: Schema = new Schema<InterfaceProgress>({
  cardSetId: String,
  cardId: String,
  userId: String,
  timeLastSuccess: Number,
  timesSuccess: Number,
});

const ModelProgress = model<InterfaceProgress>('Progress', SchemaProgress);

export { ModelProgress, SchemaProgress, InterfaceProgress };
