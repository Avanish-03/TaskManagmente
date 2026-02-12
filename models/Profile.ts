import mongoose, { Schema, Document, Model } from "mongoose"

export interface IProfile extends Document {
  studentName: string
  companyName: string
  designation: string
}

const ProfileSchema: Schema = new Schema(
  {
    studentName: { type: String, required: true },
    companyName: { type: String, required: true },
    designation: { type: String, required: true },
  },
  { timestamps: true }
)

const Profile: Model<IProfile> =
  mongoose.models.Profile ||
  mongoose.model<IProfile>("Profile", ProfileSchema)

export default Profile
