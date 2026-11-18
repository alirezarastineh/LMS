import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { styles } from "@/app/styles/styles";
import { useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import type { IAnalyticsPoint } from "@/app/types/lms";
import Loader from "../../Loader/Loader";

type UserAnalyticsProps = {
  isDashboard?: boolean;
};

const UserAnalytics = ({ isDashboard }: UserAnalyticsProps) => {
  const { data, isLoading } = useGetUsersAnalyticsQuery({});

  const analyticsData: { name: string; count: number }[] = (
    data?.users?.last12Months ?? []
  ).map((item: IAnalyticsPoint) => ({
    name: item.month,
    count: item.count,
  }));

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div
      className={`${
        isDashboard
          ? "mt-12.5 dark:bg-[#111C43] shadow-xs pb-5 rounded-xs"
          : "mt-12.5"
      }`}
    >
      <div className={`${isDashboard ? "ml-8! mb-5" : ""}`}>
        <h1
          className={`${styles.title} ${
            isDashboard && "text-[20px]!"
          } px-5 text-start!`}
        >
          Users Analytics
        </h1>
        {!isDashboard && (
          <p className={`${styles.label} px-5`}>
            Last 12 months analytics data{" "}
          </p>
        )}
      </div>

      <div
        className={`w-full ${
          isDashboard ? "h-[30vh]" : "h-screen"
        } flex items-center justify-center`}
      >
        <ResponsiveContainer
          width={isDashboard ? "100%" : "90%"}
          height={isDashboard ? "100%" : "50%"}
        >
              <AreaChart
                data={analyticsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#4d62d9"
                  fill="#4d62d9"
                />
              </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserAnalytics;
