import mongoose from 'mongoose';

interface InterfaceCard extends mongoose.Document {
  cardSetId: string;
  front: string;
  frontDescription: string;
  back?: string;
  backDescription?: string;
  hasBackSide?: boolean;
  timeAdded?: number;
  timeLastSuccess?: number;
  timesSuccess?: number;
}

const SchemaCard: mongoose.Schema = new mongoose.Schema<InterfaceCard>({
  cardSetId: String,
  front: { type: String, required: true },
  frontDescription: String,
  back: String,
  backDescription: String,
  hasBackSide: Boolean,
  timeAdded: Number,
  timeLastSuccess: Number,
  timesSuccess: Number,
});

const ModelSchemaCard = mongoose.model<InterfaceCard>('Card', SchemaCard);

export { ModelSchemaCard, SchemaCard, InterfaceCard };
