import type { ComponentType } from "react";
import { Modal, Box } from "@mui/material";

export interface CustomModalContentProps {
  setOpen: (open: boolean) => void;
  setRoute?: (route: string) => void;
  refetch?: () => void;
}

type CustomModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  component: ComponentType<CustomModalContentProps>;
  setRoute?: (route: string) => void;
  refetch?: () => void;
};

const CustomModal = ({
  open,
  setOpen,
  setRoute,
  component: Component,
  refetch,
}: CustomModalProps) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute top-[50%] left-[50%] -translate-1/2 w-[95%] m-auto 800px:w-112.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 outline-hidden">
        <Component setOpen={setOpen} setRoute={setRoute} refetch={refetch} />
      </Box>
    </Modal>
  );
};

export default CustomModal;
