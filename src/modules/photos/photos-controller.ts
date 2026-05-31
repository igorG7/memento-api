import type { Request, Response } from "express";
import service from "./photos-service.js";
import { ResolveError } from "../../shared/utils/resolveError.js";

class PhotosController {
  upload = async (req: Request, res: Response) => {
    try {
      const files = req.files as any;
      const { ...body } = req.body;

      const upload = await service.upload(files, body);

      return res.status(201).json({ message: "Recebemos sua foto!", data: upload });
    } catch (error: any) {
      console.log(error);
      ResolveError.resolve(error);
    }
  };

  list = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const { photos, meta } = await service.list(page, limit);

      return res.status(200).json({ message: "Busca concluida com sucesso!", data: photos, meta });
    } catch (error: any) {
      ResolveError.resolve(error);
    }
  };
}

export default new PhotosController();
