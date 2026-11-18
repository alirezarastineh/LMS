import cloudinary from "cloudinary";
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler, { getErrorMessage } from "../utils/ErrorHandler";
import LayoutModel from "../models/layout.model";

interface IFaqInput {
  question: string;
  answer: string;
}

interface ICategoryInput {
  title: string;
}

export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body as { type: string };

      const isTypeExist = await LayoutModel.findOne({ type });

      if (isTypeExist) {
        return next(new ErrorHandler(`${type} already exist`, 400));
      }

      if (type === "FAQ") {
        const { faq } = req.body as { faq: IFaqInput[] };

        const faqItems = faq.map((item) => ({
          question: item.question,
          answer: item.answer,
        }));

        await LayoutModel.create({ type: "FAQ", faq: faqItems });
      }

      if (type === "Categories") {
        const { categories } = req.body as { categories: ICategoryInput[] };

        const categoriesItems = categories.map((item) => ({
          title: item.title,
        }));

        await LayoutModel.create({
          type: "Categories",
          categories: categoriesItems,
        });
      }

      if (type === "Banner") {
        const { image, title, subtitle } = req.body as {
          image: string;
          title: string;
          subtitle: string;
        };

        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "Layout",
        });

        const banner = {
          type: "Banner",
          banner: {
            image: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            },
            title,
            subtitle,
          },
        };

        await LayoutModel.create(banner);
      }

      res.status(200).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 500));
    }
  }
);

export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body as { type: string };

      if (type === "FAQ") {
        const { faq } = req.body as { faq: IFaqInput[] };

        const faqData = await LayoutModel.findOne({ type: "FAQ" });

        const faqItems = faq.map((item) => ({
          question: item.question,
          answer: item.answer,
        }));

        await LayoutModel.findByIdAndUpdate(faqData?._id, {
          type: "FAQ",
          faq: faqItems,
        });
      }

      if (type === "Categories") {
        const { categories } = req.body as { categories: ICategoryInput[] };

        const categoriesData = await LayoutModel.findOne({
          type: "Categories",
        });

        const categoriesItems = categories.map((item) => ({
          title: item.title,
        }));

        await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
          type: "Categories",
          categories: categoriesItems,
        });
      }

      if (type === "Banner") {
        const bannerData = await LayoutModel.findOne({ type: "Banner" });

        const { image, title, subtitle } = req.body as {
          image: string;
          title: string;
          subtitle: string;
        };

        const uploadedImage = image.startsWith("https")
          ? null
          : await cloudinary.v2.uploader.upload(image, {
              folder: "Layout",
            });

        const banner = {
          type: "Banner",
          banner: {
            image: {
              public_id: image.startsWith("https")
                ? bannerData?.banner.image.public_id
                : uploadedImage?.public_id,
              url: image.startsWith("https")
                ? bannerData?.banner.image.url
                : uploadedImage?.secure_url,
            },
            title,
            subtitle,
          },
        };

        await LayoutModel.findByIdAndUpdate(bannerData?._id, { banner });
      }

      res.status(200).json({
        success: true,
        message: "Layout updated successfully",
      });
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 500));
    }
  }
);

export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;

      const layout = await LayoutModel.findOne({ type });

      res.status(201).json({
        success: true,
        layout,
      });
    } catch (error: unknown) {
      return next(new ErrorHandler(getErrorMessage(error), 500));
    }
  }
);
