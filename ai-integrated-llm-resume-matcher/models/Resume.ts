import { Schema, models, model } from "mongoose";

const ResumeSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default models.Resume || model("Resume", ResumeSchema);