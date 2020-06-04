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
  timeLastFailed?: number;
  timesFailed?: number;
  timesSuccess?: number;
}

interface InterfaceSchemaCardSet extends Document {
  userId?: string;
  name: string;
  cards: [InterfaceCard] | [];
}

const SchemaCardSet: mongoose.Schema = new mongoose.Schema<InterfaceSchemaCardSet>({
  userId: mongoose.Types.ObjectId,
  name: String,
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
      timeLastFailed: Number,
      timesFailed: Number,
      timesSuccess: Number,
    },
  ],
});

export { SchemaCardSet, InterfaceSchemaCardSet, InterfaceCard };
