import mongoose, { Document } from 'mongoose';

interface InterfaceSchemaCardSet extends Document {
  userId?: string;
  name: string;
  cardsMax: number;
  isShared: boolean;
}

const SchemaCardSet: mongoose.Schema = new mongoose.Schema<InterfaceSchemaCardSet>({
  userId: mongoose.Types.ObjectId,
  name: String,
  cardsMax: Number,
  isShared: Boolean,
});

const ModelSchemaCardSet = mongoose.model<InterfaceSchemaCardSet>('CardSet', SchemaCardSet);

export { SchemaCardSet, ModelSchemaCardSet, InterfaceSchemaCardSet };
