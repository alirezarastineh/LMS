import { useMemo } from "react";
import UserAnalytics from "../Analytics/UserAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrdersAnalytics from "../Analytics/OrdersAnalytics";
import AllInvoices from "../Order/AllInvoices";
import type { IAnalyticsPoint } from "@/app/types/lms";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";

type DashboardProps = {
  open?: boolean;
};

type CircularProgressWithLabelProps = {
  open?: boolean;
  value?: number;
};

interface ComparePercentage {
  currentMonth: number;
  previousMonth: number;
  percentChange: number;
}

const CircularProgressWithLabel = ({
  open,
  value,
}: CircularProgressWithLabelProps) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? "info" : "error"}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />

      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </Box>
  );
};

const computeComparePercentage = (
  points: IAnalyticsPoint[]
): ComparePercentage | undefined => {
  const lastTwoMonths = points.slice(-2);
  if (lastTwoMonths.length !== 2) {
    return undefined;
  }

  const currentMonth = lastTwoMonths[1].count;
  const previousMonth = lastTwoMonths[0].count;
  const percentChange =
    previousMonth === 0
      ? 100
      : ((currentMonth - previousMonth) / previousMonth) * 100;

  return { currentMonth, previousMonth, percentChange };
};

const DashboardWidgets = ({ open }: DashboardProps) => {
  const { data, isLoading } = useGetUsersAnalyticsQuery({});

  const { data: ordersData, isLoading: ordersLoading } =
    useGetOrdersAnalyticsQuery({});

  const { ordersComparePercentage, userComparePercentage } = useMemo(() => {
    if (isLoading && ordersLoading) {
      return {
        ordersComparePercentage: undefined,
        userComparePercentage: undefined,
      };
    }

    if (!data?.users?.last12Months || !ordersData?.orders?.last12Months) {
      return {
        ordersComparePercentage: undefined,
        userComparePercentage: undefined,
      };
    }

    return {
      userComparePercentage: computeComparePercentage(
        data.users.last12Months
      ),
      ordersComparePercentage: computeComparePercentage(
        ordersData.orders.last12Months
      ),
    };
  }, [isLoading, ordersLoading, data, ordersData]);

  return (
    <div className="mt-7.5 min-h-screen">
      <div className="grid grid-cols-[75%_25%]">
        <div className="p-8">
          <UserAnalytics isDashboard={true} />
        </div>

        <div className="pt-20 pr-8">
          <div className="w-full dark:bg-[#111C43] rounded-xs shadow-sm">
            <div className="flex items-center p-5 justify-between">
              <div className="">
                <BiBorderLeft className="dark:text-[#45CBA0] text-black text-[30px]" />
                <h5 className="pt-2 font-Poppins dark:text-white text-black text-[20px]">
                  {ordersComparePercentage?.currentMonth}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-[#45CBA0] text-black text-[20px] font-normal">
                  Sales Obtained
                </h5>
              </div>
              <div>
                <CircularProgressWithLabel
                  value={
                    (ordersComparePercentage?.percentChange ?? 0) > 0 ? 100 : 0
                  }
                  open={open}
                />
                <h5 className="text-center pt-4">
                  {(ordersComparePercentage?.percentChange ?? 0) > 0
                    ? `+${(ordersComparePercentage?.percentChange ?? 0).toFixed(2)}`
                    : `-${(ordersComparePercentage?.percentChange ?? 0).toFixed(2)}`}
                  %
                </h5>
              </div>
            </div>
          </div>

          <div className="w-full dark:bg-[#111C43] rounded-xs shadow-sm my-8">
            <div className="flex items-center p-5 justify-between">
              <div className="">
                <PiUsersFourLight className="dark:text-[#45CBA0] text-black text-[30px]" />
                <h5 className="pt-2 font-Poppins dark:text-white text-black text-[20px]">
                  {userComparePercentage?.currentMonth}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-[#45CBA0] text-black text-[20px] font-normal">
                  New Users
                </h5>
              </div>
              <div>
                <CircularProgressWithLabel
                  value={
                    (userComparePercentage?.percentChange ?? 0) > 0 ? 100 : 0
                  }
                  open={open}
                />
                <h5 className="text-center pt-4">
                  {(userComparePercentage?.percentChange ?? 0) > 0
                    ? `+${(userComparePercentage?.percentChange ?? 0).toFixed(2)}`
                    : `-${(userComparePercentage?.percentChange ?? 0).toFixed(2)}`}
                  %
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[65%_35%] -mt-5">
        <div className="dark:bg-[#111c43] w-[94%] mt-7.5 h-[40vh] shadow-xs m-auto">
          <OrdersAnalytics isDashboard={true} />
        </div>
        <div className="p-5">
          <h5 className="dark:text-white text-black text-[20px] font-normal font-Poppins pb-3">
            Recent Transactions
          </h5>
          <AllInvoices isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
