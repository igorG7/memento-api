// import { Readable } from "stream";
// import cloudinary from "../../config/cloudinary.ts";

// class CloudinaryService {
//   uploadToCloudinary = async (buffer: Buffer, folder: string) => {
//     return new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         {
//           folder,
//           resource_type: "image",
//         },
//         (error, result) => {
//           if (error || !result) return reject(error);

//           resolve({
//             publicId: result.public_id,
//             secureUrl: result.secure_url,
//             width: result.width,
//             height: result.height,
//             bytes: result.bytes,
//             format: result.format,
//           });
//         },
//       );

//       Readable.from(buffer).pipe(stream);
//     });
//   };

//   deleteFromCloudinary = async (public_id: string) => {
//     await cloudinary.uploader.destroy(public_id);
//   };
// }

// export default new CloudinaryService();

import { Readable } from "stream";
import cloudinary from "../../config/cloudinary.ts";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// 1. Defina uma interface para o retorno da sua função
interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
}

class CloudinaryService {
  // 2. Adicione a tipagem do retorno da Promise (: Promise<CloudinaryUploadResult>)
  uploadToCloudinary = async (buffer: Buffer, folder: string): Promise<CloudinaryUploadResult> => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          // 3. Tratamento de erro mais seguro
          if (error) return reject(error);
          if (!result)
            return reject(new Error("Upload falhou: Nenhum resultado retornado do Cloudinary."));

          resolve({
            publicId: result.public_id,
            secureUrl: result.secure_url,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            format: result.format,
          });
        },
      );

      Readable.from(buffer).pipe(stream);
    });
  };

  // 4. Tratamento de erro básico para a deleção
  deleteFromCloudinary = async (public_id: string): Promise<void> => {
    try {
      const result = await cloudinary.uploader.destroy(public_id);
      if (result.result !== "ok" && result.result !== "not found") {
        throw new Error(`Erro ao deletar: ${result.result}`);
      }
    } catch (error) {
      console.error("Erro no serviço Cloudinary (delete):", error);
      throw error;
    }
  };
}

export default new CloudinaryService();
