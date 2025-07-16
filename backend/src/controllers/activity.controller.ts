import { NextFunction, Request, Response } from "express";
import { activityModel } from "../models/Activity";


// Create activity
export const createActivity = async (req: Request, res :Response, next:NextFunction) => {
  try {
    const { type, userId, bookId, description } = req.body;

    const activity = new activityModel({
      type,
      user: userId,
      book: bookId,
      description,
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    next(err)
  }
};

// Get recent activities
export const getRecentActivities = async (req: Request, res :Response, next:NextFunction) => {
  try {
    const activities = await activityModel.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate("user", "name")
      .populate("book", "title");

    res.json(activities);
  } catch (err) {
    next(err)
  }
};
