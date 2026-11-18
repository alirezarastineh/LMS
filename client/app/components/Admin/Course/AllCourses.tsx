import { useState } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { format } from "timeago.js";
import { FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";

import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import { getApiErrorMessage, type ICourse } from "@/app/types/lms";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/styles";
import { getDataGridContainerSx } from "@/app/utils/dataGridStyles";

interface CourseRow {
  id: string;
  title: string;
  ratings: number;
  purchased: number;
  created_at: string;
}

const AllCourses = () => {
  const { theme } = useTheme();

  const [open, setOpen] = useState(false);

  const [courseId, setCourseId] = useState("");

  const { isLoading, data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const [deleteCourse] = useDeleteCourseMutation({});

  const columns: GridColDef<CourseRow>[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "  ",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params: GridRenderCellParams<CourseRow>) => {
        return (
          <Link href={`/admin/edit-course/${params.row.id}`}>
            <FiEdit2 className="dark:text-white text-black" size={20} />
          </Link>
        );
      },
    },
    {
      field: " ",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: GridRenderCellParams<CourseRow>) => {
        return (
          <Button
            onClick={() => {
              setOpen(!open);
              setCourseId(params.row.id);
            }}
          >
            <AiOutlineDelete className="dark:text-white text-black" size={20} />
          </Button>
        );
      },
    },
  ];

  const rows: CourseRow[] = (data?.courses ?? []).map((item: ICourse) => ({
    id: item._id,
    title: item.name,
    ratings: item.ratings ?? 0,
    purchased: item.purchased ?? 0,
    created_at: item.createdAt ? format(item.createdAt) : "",
  }));

  const handleDelete = async () => {
    try {
      await deleteCourse(courseId).unwrap();
      setOpen(false);
      void refetch();
      toast.success("Course Deleted Successfully");
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
          <Box sx={getDataGridContainerSx(theme)}>
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-1/2 w-112.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 outline-hidden">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this course?
                </h1>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <button
                    type="button"
                    className={`${styles.button} w-30! h-7.5 bg-[#47d097] border-0`}
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
