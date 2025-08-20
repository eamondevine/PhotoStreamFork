import mongoose from "mongoose";

export interface Test extends mongoose.Document {
  key: string;
  gps?: {
    lat: number;
    lng: number;
  };
  note?: string;
  title?: string;
  tags?: string[];
  time?: string;
}

const TestSchema = new mongoose.Schema<Test>(
  {
    key: {
      type: String,
    },
    gps: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    note: {
      type: String,
    },
    title: {
      type: String,
      maxlength: [40, "Title cannot be more than 40 characters"],
    },
    tags: {
      type: [String],
      maxlength: [10, "Tag cannot be more than 10 characters"],
    },
    time: {
      type: [String],
    },
  },
  { collection: "Photos" }
);

const TestModel =
  mongoose.models.TestPhotos || mongoose.model<Test>("TestPhotos", TestSchema);

export default TestModel;
