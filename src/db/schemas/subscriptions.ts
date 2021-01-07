import mongoose, { Document } from 'mongoose';

interface InterfaceSchemaSubscription extends Document {
  userId: string;
  cardSetId: string;
}

const SchemaSubscription: mongoose.Schema = new mongoose.Schema<InterfaceSchemaSubscription>({
  userId: mongoose.Types.ObjectId,
  cardSetId: String,
});

const ModelSubscription = mongoose.model<InterfaceSchemaSubscription>('Subscription', SchemaSubscription);

export { SchemaSubscription, ModelSubscription, InterfaceSchemaSubscription };
