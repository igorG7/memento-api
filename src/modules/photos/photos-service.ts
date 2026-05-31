import cloudinaryService from "../../integrations/cloudinary/service-cloudinary.js";
import Photo from "./infrastructure/photo.js";

class PhotoService {
  upload = async (files: any, data: any) => {
    const buffers = files.map((item: any) => item.buffer);

    const uploads = await Promise.all(
      buffers.map(
        async (buffer: any) =>
          await cloudinaryService.uploadToCloudinary(buffer, `memento/events/${data.eventId}`),
      ),
    );

    const uploadToSave = uploads.map((u) => {
      return {
        eventId: data.eventId,
        guestName: data.guestName,
        category: data.category,
        cloudinary: {
          publicId: u.publicId,
          secureUrl: u.secureUrl,
          width: u.width,
          height: u.height,
          bytes: u.bytes,
          format: u.format,
        },
        status: "pending",
        uploadedAt: new Date(),
      };
    });

    await Photo.insertMany(uploadToSave.map((u) => u));

    return uploadToSave;
  };

  list = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const photos = await Photo.find().limit(limit).skip(skip).sort({ uploadedAt: -1 });
    const sizeCollection = await Photo.countDocuments();

    const totalPages = Math.ceil(sizeCollection / limit);

    return {
      photos,
      meta: {
        total: sizeCollection,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  };
}

export default new PhotoService();
