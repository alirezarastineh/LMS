import { useState } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import Loader from "../../Loader/Loader";
import { getDataGridContainerSx } from "@/app/utils/dataGridStyles";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/features/user/userApi";
import { getApiErrorMessage, type IUser } from "@/app/types/lms";
import { styles } from "@/app/styles/styles";

type AllUsersProps = {
  isTeam?: boolean;
};

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  courses: number;
  created_at: string;
}

const AllCourses = ({ isTeam }: AllUsersProps) => {
  const { theme } = useTheme();

  const [active, setActive] = useState(false);

  const [email, setEmail] = useState("");

  const [role, setRole] = useState("admin");

  const [open, setOpen] = useState(false);

  const [userId, setUserId] = useState("");

  const [updateUserRole] = useUpdateUserRoleMutation();

  const { isLoading, data, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [deleteUser] = useDeleteUserMutation({});

  const columns: GridColDef<UserRow>[] = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Role", flex: 0.5 },
    { field: "courses", headerName: "Purchased Courses", flex: 0.5 },
    { field: "created_at", headerName: "Joined At", flex: 0.5 },
    {
      field: " ",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: GridRenderCellParams<UserRow>) => {
        return (
          <Button
            onClick={() => {
              setOpen(!open);
              setUserId(params.row.id);
            }}
          >
            <AiOutlineDelete className="dark:text-white text-black" size={20} />
          </Button>
        );
      },
    },
    {
      field: "  ",
      headerName: "Email",
      flex: 0.2,
      renderCell: (params: GridRenderCellParams<UserRow>) => {
        return (
          <a href={`mailto:${params.row.email}`}>
            <AiOutlineMail className="dark:text-white text-black" size={20} />
          </a>
        );
      },
    },
  ];

  const allUsers: IUser[] = data?.users ?? [];
  const filteredUsers = isTeam
    ? allUsers.filter((item) => item.role === "admin")
    : allUsers;

  const rows: UserRow[] = filteredUsers.map((item) => ({
    id: item._id,
    name: item.name,
    email: item.email,
    role: item.role,
    courses: item.courses?.length ?? 0,
    created_at: item.createdAt ? format(item.createdAt) : "",
  }));

  const handleSubmit = async () => {
    try {
      await updateUserRole({ email, role }).unwrap();
      void refetch();
      toast.success("User role updated successfully");
      setActive(false);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userId).unwrap();
      void refetch();
      toast.success("Delete user successfully!");
      setOpen(false);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="mt-30">
      {isLoading ? (
        <Loader />
      ) : (
        <Box sx={{ m: "20px" }}>
          {isTeam && (
            <div className="w-full flex justify-end">
              <button
                type="button"
                className={`${styles.button} w-50! rounded-[10px]! dark:bg-[#57c7a3] h-8.75! dark:border dark:border-[#ffffff6c] border-0`}
                onClick={() => setActive(!active)}
              >
                Add New Member
              </button>
            </div>
          )}
          <Box sx={getDataGridContainerSx(theme)}>
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>
          {active && (
            <Modal
              open={active}
              onClose={() => setActive(!active)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-1/2 w-112.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 outline-hidden">
                <h1 className={`${styles.title}`}>Add New Member</h1>
                <div className="mt-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email..."
                    className={`${styles.input}`}
                  />
                  <select
                    name=""
                    id=""
                    className={`${styles.input} mt-6!`}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <br />
                  <button
                    type="button"
                    className={`${styles.button} my-6 h-7.5! border-0`}
                    onClick={() => {
                      void handleSubmit();
                    }}
                  >
                    Submit
                  </button>
                </div>
              </Box>
            </Modal>
          )}

          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-1/2 w-112.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 outline-hidden">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this user?
                </h1>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <button
                    type="button"
                    className={`${styles.button} w-30! h-7.5 bg-[#57c7a3] border-0`}
                    onClick={() => setOpen(!open)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`${styles.button} w-30! h-7.5 bg-[#d63f3f] border-0`}
                    onClick={() => {
                      void handleDelete();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllCourses;
