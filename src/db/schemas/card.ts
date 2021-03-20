import { Document, Schema, model } from 'mongoose';

interface InterfaceCard extends Document {
  cardSetId: string;
  front: string;
  frontDescription: string;
  back?: string;
  backDescription?: string;
  hasBackSide?: boolean;
  timeAdded: number;
}

const SchemaCard: Schema = new Schema<InterfaceCard>({
  cardSetId: String,
  front: { type: String, required: true },
  frontDescription: String,
  back: String,
  backDescription: String,
  hasBackSide: Boolean,
  timeAdded: Number,
});

const ModelSchemaCard = model<InterfaceCard>('Card', SchemaCard);

export { ModelSchemaCard, SchemaCard, InterfaceCard };
