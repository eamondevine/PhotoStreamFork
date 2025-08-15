import mongoose from "mongoose";

export interface Test extends mongoose.Document {
  _id: string;
  name?: string;
  owner_name?: string;
  species?: string;
  age?: number;
}

/* PetSchema will correspond to a collection in your MongoDB database. */
const TestSchema = new mongoose.Schema<Test>(
  {
    name: {
      /* The name of this pet */

      type: String,
      required: [true, "Please provide a name for this pet."],
      maxlength: [60, "Name cannot be more than 60 characters"],
    },
    owner_name: {
      /* The owner of this pet */

      type: String,
      required: [true, "Please provide the pet owner's name"],
      maxlength: [60, "Owner's Name cannot be more than 60 characters"],
    },
    species: {
      /* The species of your pet */

      type: String,
      required: [true, "Please specify the species of your pet."],
      maxlength: [40, "Species specified cannot be more than 40 characters"],
    },
    age: {
      /* Pet's age, if applicable */

      type: Number,
    },
  },
  { collection: "Pets" }
);

const TestModel =
  mongoose.models.Test || mongoose.model<Test>("TestData", TestSchema);

export default TestModel;
