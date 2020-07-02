import mongoose from 'mongoose';

interface InterfaceSchemaUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SchemaUser: mongoose.Schema = new mongoose.Schema<InterfaceSchemaUser>({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const ModelUser = mongoose.model<InterfaceSchemaUser>('User', SchemaUser);

export { SchemaUser, ModelUser, InterfaceSchemaUser };
