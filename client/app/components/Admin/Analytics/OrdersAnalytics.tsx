import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { styles } from "@/app/styles/styles";
import { useGetOrdersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import type { IAnalyticsPoint } from "@/app/types/lms";
import Loader from "../../Loader/Loader";

type OrdersAnalyticsProps = {
  isDashboard?: boolean;
};

export default function OrdersAnalytics({
  isDashboard,
}: Readonly<OrdersAnalyticsProps>) {
  const { data, isLoading } = useGetOrdersAnalyticsQuery({});

  const analyticsData: { name: string; Count: number }[] = (
    data?.orders?.last12Months ?? []
  ).map((item: IAnalyticsPoint) => ({
    name: item.month,
    Count: item.count,
  }));

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={isDashboard ? "h-[30vh]" : "h-screen"}>
      <div className={isDashboard ? "mt-0 pl-10 mb-2" : "mt-12.5"}>
        <h1
          className={`${styles.title} ${
            isDashboard && "text-[20px]!"
          } px-5 text-start!`}
        >
          Orders Analytics
        </h1>
        {!isDashboard && (
          <p className={`${styles.label} px-5`}>
            Last 12 months analytics data{" "}
          </p>
        )}
      </div>
      <div
        className={`w-full ${
          isDashboard ? "h-full" : "h-[90%]"
        } flex items-center justify-center`}
      >
        <ResponsiveContainer
          width={isDashboard ? "100%" : "90%"}
          height={isDashboard ? "100%" : "50%"}
        >
          <LineChart
            width={500}
            height={300}
            data={analyticsData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {!isDashboard && <Legend />}
            <Line type="monotone" dataKey="Count" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
