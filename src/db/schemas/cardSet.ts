import mongoose, { Document } from 'mongoose';

interface InterfaceCard {
  uuid: string;
  front: string;
  frontDescription: string;
  back?: string;
  backDescription?: string;
  hasBackSide?: boolean;
  timeAdded?: number;
  timeLastSuccess?: number;
  timesSuccess?: number;
}

interface InterfaceSchemaCardSet extends Document {
  userId?: string;
  name: string;
  cardsMax: number;
  cards: [InterfaceCard] | [];
}

const SchemaCardSet: mongoose.Schema = new mongoose.Schema<InterfaceSchemaCardSet>({
  userId: mongoose.Types.ObjectId,
  name: String,
  cardsMax: Number,
  cards: [
    {
      uuid: String,
      front: { type: String, required: true },
      frontDescription: String,
      back: String,
      backDescription: String,
      hasBackSide: Boolean,
      timeAdded: Number,
      timeLastSuccess: Number,
      timesSuccess: Number,
    },
  ],
});

const ModelSchemaCardSet = mongoose.model<InterfaceSchemaCardSet>('CardSet', SchemaCardSet);

export { SchemaCardSet, ModelSchemaCardSet, InterfaceSchemaCardSet, InterfaceCard };
