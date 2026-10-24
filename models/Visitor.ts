import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVisitor extends Document {
  date: string; // YYYY-MM-DD
  count: number;
  uniqueIps: string[];
  createdAt: Date;
  updatedAt: Date;
}

const VisitorSchema = new Schema<IVisitor>(
  {
    date: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    uniqueIps: [{ type: String }],
  },
  { timestamps: true }
);

const Visitor: Model<IVisitor> =
  mongoose.models.Visitor || mongoose.model<IVisitor>('Visitor', VisitorSchema);

export default Visitor;
