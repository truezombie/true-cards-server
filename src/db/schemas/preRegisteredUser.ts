import mongoose from 'mongoose';

interface InterfacePreRegisteredUser extends mongoose.Document {
  email: string;
  currentLinkUuid: string;
}

const SchemaPreRegisteredUser: mongoose.Schema = new mongoose.Schema<InterfacePreRegisteredUser>({
  email: String,
  currentLinkUuid: String,
});

const ModelPreRegisteredUser = mongoose.model<InterfacePreRegisteredUser>('preRegisteredUser', SchemaPreRegisteredUser);

export { SchemaPreRegisteredUser, ModelPreRegisteredUser, InterfacePreRegisteredUser };
