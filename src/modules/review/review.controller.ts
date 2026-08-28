// biome-ignore assist/source/organizeImports: <explanation>
import type { Request, Response, NextFunction } from "express";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO
  } catch (error) {
    next(error);
  }
};

const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO
  } catch (error) {
    next(error);
  }
};

const getReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO
  } catch (error) {
    next(error);
  }
};

const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO
  } catch (error) {
    next(error);
  }
};

export const reviewController = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
