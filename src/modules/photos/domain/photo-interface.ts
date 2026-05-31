export const PHOTO_CATEGORY = [
  "selfie",
  "bastidores",
  "cerimonia",
  "festa",
  "pista",
  "aleatorias",
] as const;
export type PhotoCategoryType = (typeof PHOTO_CATEGORY)[number];

export const PHOTOS_STATUS = ["pending", "approved", "hidden", "deleted"] as const;
export type PhotoStatusType = (typeof PHOTOS_STATUS)[number];

export interface CloudinaryData {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
}

export interface IPhoto {
  _id: string;
  eventId: string;
  guestName?: string;
  category: PhotoCategoryType;
  cloudinary: CloudinaryData;
  status: PhotoStatusType;
  uploadedAt: Date;
}
