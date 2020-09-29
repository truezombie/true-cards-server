import mongoose from 'mongoose';

interface InterfaceSchemaUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  learningSession: string[];
  learningSessionCardSetId: string;
  learningSessionCurrentCardIndex: number;
  passwordResetConfirmationKey: string;
  forgettingIndex: number;
}

const SchemaUser: mongoose.Schema = new mongoose.Schema<InterfaceSchemaUser>({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  learningSession: [String],
  learningSessionCardSetId: String,
  learningSessionCurrentCardIndex: Number,
  passwordResetConfirmationKey: String,
  forgettingIndex: Number,
});

const ModelUser = mongoose.model<InterfaceSchemaUser>('User', SchemaUser);

export { SchemaUser, ModelUser, InterfaceSchemaUser };
