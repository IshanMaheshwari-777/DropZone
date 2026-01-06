import { FoundItem } from "../models/foundItem.model";

export const deactivateOldPosts = async () => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 14);

    const result = await FoundItem.updateMany(
      {
        status: "ACTIVE",
        createdAt: { $lt: cutoffDate },
      },
      {
        $set: { status: "INACTIVE" },
      }
    );

    console.log(
      `Auto-deactivated ${result.modifiedCount} old posts`
    );
  } catch (error) {
    console.error("Auto-deactivation failed:", error);
  }
};

