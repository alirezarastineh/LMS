import { useMemo } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import { format } from "timeago.js";
import { AiOutlineMail } from "react-icons/ai";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import type { ICourse, IOrder, IUser } from "@/app/types/lms";
import { getDataGridContainerSx } from "@/app/utils/dataGridStyles";

type AllInvoicesProps = {
  isDashboard?: boolean;
};

interface InvoiceRow {
  id: string;
  userName: string;
  userEmail: string;
  title: string;
  price: string;
  created_at: string;
}

function buildInvoiceColumns(isDashboard?: boolean): GridColDef<InvoiceRow>[] {
  const baseColumns: GridColDef<InvoiceRow>[] = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "userName", headerName: "Name", flex: isDashboard ? 0.6 : 0.5 },
  ];

  if (isDashboard) {
    return [
      ...baseColumns,
      { field: "price", headerName: "Price", flex: 0.5 },
      { field: "created_at", headerName: "Created At", flex: 0.5 },
    ];
  }

  return [
    ...baseColumns,
    { field: "userEmail", headerName: "Email", flex: 1 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "price", headerName: "Price", flex: 0.5 },
    {
      field: " ",
      headerName: "Email",
      flex: 0.2,
      renderCell: (params: GridRenderCellParams<InvoiceRow>) => (
        <a href={`mailto:${params.row.userEmail}`}>
          <AiOutlineMail className="dark:text-white text-black" size={20} />
        </a>
      ),
    },
  ];
}

const AllInvoices = ({ isDashboard }: AllInvoicesProps) => {
  const { theme } = useTheme();

  const { isLoading, data } = useGetAllOrdersQuery({});

  const { data: usersData } = useGetAllUsersQuery({});

  const { data: coursesData } = useGetAllCoursesQuery({});

  const rows = useMemo<InvoiceRow[]>(() => {
    const orders: IOrder[] = data?.orders ?? [];
    const users: IUser[] = usersData?.users ?? [];
    const courses: ICourse[] = coursesData?.courses ?? [];

    return orders.map((item) => {
      const user = users.find((u) => u._id === item.userId);
      const course = courses.find((c) => c._id === item.courseId);

      return {
        id: item._id,
        userName: user?.name ?? "",
        userEmail: user?.email ?? "",
        title: course?.name ?? "",
        price: `€${course?.price ?? ""}`,
        created_at: format(item.createdAt),
      };
    });
  }, [data?.orders, usersData?.users, coursesData?.courses]);

  const columns = useMemo(
    () => buildInvoiceColumns(isDashboard),
    [isDashboard]
  );

  return (
    <div className={isDashboard ? "mt-0" : "mt-30"}>
      {isLoading ? (
        <Loader />
      ) : (
        <Box sx={{ m: isDashboard ? "0" : "40px" }}>
          <Box
            sx={getDataGridContainerSx(theme, {
              margin: isDashboard ? "0" : "40px 0 0 0",
              height: isDashboard ? "35vh" : "90vh",
              overflow: "hidden",
            })}
          >
            <DataGrid
              checkboxSelection={!isDashboard}
              rows={rows}
              columns={columns}
              showToolbar={!isDashboard}
            />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;
