import mongoose from 'mongoose';

interface InterfaceSchemaUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SchemaUser: mongoose.Schema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

export { SchemaUser, InterfaceSchemaUser };
