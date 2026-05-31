import { Schema, model, Document, Types } from "mongoose";
import {
  type CloudinaryData,
  type IPhoto,
  PHOTO_CATEGORY,
  PHOTOS_STATUS,
} from "../domain/photo-interface.js";

export interface IPhotoDocument extends Omit<IPhoto, "_id" | "eventId">, Document {
  eventId: string;
}

const cloudinarySchema = new Schema<CloudinaryData>(
  {
    publicId: { type: String, required: true },
    secureUrl: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    bytes: { type: Number, required: true },
    format: { type: String, required: true },
  },
  { _id: false },
);

const photoSchema = new Schema<IPhotoDocument>(
  {
    eventId: { type: String, required: true },
    guestName: { type: String, trim: true },
    category: {
      type: String,
      enum: Object.values(PHOTO_CATEGORY),
      required: true,
    },
    cloudinary: { type: cloudinarySchema, required: true },
    status: {
      type: String,
      enum: Object.values(PHOTOS_STATUS),
      default: PHOTOS_STATUS[0],
    },
    uploadedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

photoSchema.index({ eventId: 1 });
photoSchema.index({ status: 1 });
photoSchema.index({ uploadedAt: -1 });
photoSchema.index({ eventId: 1, status: 1 });

const Photo = model<IPhotoDocument>("Photo", photoSchema);
export default Photo;
