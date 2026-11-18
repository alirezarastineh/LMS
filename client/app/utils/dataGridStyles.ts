import type { SxProps, Theme } from "@mui/material";

interface DataGridContainerOptions {
  margin?: string;
  height?: string;
  overflow?: string;
}

const DARK_PALETTE = {
  textColor: "#fff",
  headerBg: "#3e4396",
  scrollerBg: "#1F2A40",
  rowBorder: "1px solid #ffffff30!important",
  checkboxColor: "#b7ebde !important",
} as const;

const LIGHT_PALETTE = {
  textColor: "#000",
  headerBg: "#A4A9FC",
  scrollerBg: "#F2F0F0",
  rowBorder: "1px solid #ccc!important",
  checkboxColor: "#000 !important",
} as const;

/**
 * Returns themed MUI DataGrid container styles shared across admin tables.
 */
export function getDataGridContainerSx(
  theme: string | undefined,
  options: DataGridContainerOptions = {}
): SxProps<Theme> {
  const palette = theme === "dark" ? DARK_PALETTE : LIGHT_PALETTE;

  return {
    m: options.margin ?? "40px 0 0 0",
    height: options.height ?? "80vh",
    ...(options.overflow ? { overflow: options.overflow } : {}),
    "& .MuiDataGrid-root": {
      border: "none",
      outline: "none",
    },
    "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
      color: palette.textColor,
    },
    "& .MuiDataGrid-sortIcon": {
      color: palette.textColor,
    },
    "& .MuiDataGrid-row": {
      color: palette.textColor,
      borderBottom: palette.rowBorder,
    },
    "& .MuiTablePagination-root": {
      color: palette.textColor,
    },
    "& .MuiDataGrid-cell": {
      borderBottom: "none!important",
    },
    "& .name-column--cell": {
      color: palette.textColor,
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: palette.headerBg,
      borderBottom: "none",
      color: palette.textColor,
    },
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: palette.scrollerBg,
    },
    "& .MuiDataGrid-footerContainer": {
      color: palette.textColor,
      borderTop: "none",
      backgroundColor: palette.headerBg,
    },
    "& .MuiCheckbox-root": {
      color: palette.checkboxColor,
    },
    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
      color: "#fff !important",
    },
  };
}
