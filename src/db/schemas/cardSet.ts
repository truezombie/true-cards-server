import mongoose, { Document } from 'mongoose';

interface InterfaceSchemaCardSet extends Document {
  userId?: string;
  name: string;
  cardsMax: number;
}

const SchemaCardSet: mongoose.Schema = new mongoose.Schema<InterfaceSchemaCardSet>({
  userId: mongoose.Types.ObjectId,
  name: String,
  cardsMax: Number, // TODO: maybe do not use
});

const ModelSchemaCardSet = mongoose.model<InterfaceSchemaCardSet>('CardSet', SchemaCardSet);

export { SchemaCardSet, ModelSchemaCardSet, InterfaceSchemaCardSet };
