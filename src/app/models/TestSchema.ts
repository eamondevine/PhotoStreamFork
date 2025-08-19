import mongoose from "mongoose";

export interface Test extends mongoose.Document {
  url: string;
  gps?: {
    lat: number;
    lng: number;
  };
  note?: string;
  title?: string;
  tags?: string[];
}

const TestSchema = new mongoose.Schema<Test>(
  {
    url: {
      type: String,
      required: [true, "Must have associated url."],
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
  },
  { collection: "Photos" }
);

const TestModel =
  mongoose.models.TestPhotos || mongoose.model<Test>("TestPhotos", TestSchema);

export default TestModel;
