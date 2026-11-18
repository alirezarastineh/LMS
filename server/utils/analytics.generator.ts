import { Document, Model } from "mongoose";

interface MonthData {
  month: string;
  count: number;
}

export async function generateLast12MonthsData<T extends Document>(
  model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
  const currentDate = new Date();

  currentDate.setDate(currentDate.getDate() + 1);

  const monthRanges = Array.from({ length: 12 }, (_, index) => {
    const i = 11 - index;
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i * 28
    );

    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - 28
    );

    const monthYear = endDate.toLocaleString("default", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return { monthYear, startDate, endDate };
  });

  const last12Months = await Promise.all(
    monthRanges.map(async ({ monthYear, startDate, endDate }) => {
      const count = await model.countDocuments({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      });
      return { month: monthYear, count };
    })
  );

  return { last12Months };
}
