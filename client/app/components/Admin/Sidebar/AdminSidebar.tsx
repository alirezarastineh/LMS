"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import type { RootState } from "@/redux/features/store";
import { resolveNonEmpty } from "@/app/types/lms";
import {
  HomeOutlinedIcon,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  MapOutlinedIcon,
  GroupsIcon,
  OndemandVideoIcon,
  VideoCallIcon,
  WebIcon,
  QuizIcon,
  WysiwygIcon,
  ManageHistoryIcon,
  ExitToAppIcon,
} from "./Icon";

interface ItemProps {
  title: string;
  to: string;
  icon: ReactNode;
  selected: string;
  setSelected: (title: string) => void;
}

const noop = () => undefined;
const emptySubscribe = () => noop;

const Item = ({ title, to, icon, selected, setSelected }: ItemProps) => {
  const handleClick = () => {
    setSelected(title);
  };

  return (
    <MenuItem
      active={selected === title}
      onClick={handleClick}
      icon={icon}
      component={<Link href={to} />}
    >
      <Typography className="text-[16px]! font-Poppins!">{title}</Typography>
    </MenuItem>
  );
};

const Sidebar = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [selected, setSelected] = useState("Dashboard");

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const { theme } = useTheme();

  if (!mounted) {
    return null;
  }

  return (
    <Box
      sx={{
        "& .ps-sidebar-container": {
          background: `${
            theme === "dark" ? "#111C43 !important" : "#fff !important"
          }`,
        },

        "& .ps-menu-icon": {
          backgroundColor: "transparent !important",
        },

        "& .ps-menu-button:hover": {
          color: "#868dfb !important",
          backgroundColor: "transparent !important",
        },

        "& .ps-menu-button.ps-active": {
          color: "#6870fa !important",
        },

        "& .ps-menu-button": {
          padding: "5px 35px 5px 20px !important",
          opacity: 1,
          color: theme === "dark" ? "#fff" : "#000",
        },
      }}
      className="bg-white! dark:bg-[#111C43]"
    >
      <ProSidebar
        collapsed={isCollapsed}
        width="16%"
        collapsedWidth="80px"
        backgroundColor={theme === "dark" ? "#111C43" : "#fff"}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 99_999_999_999_999,
        }}
      >
        <Menu>
          <MenuItem
            component={<div />}
            onClick={isCollapsed ? () => setIsCollapsed(false) : undefined}
            icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            {!isCollapsed && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  ml: "15px",
                }}
              >
                <Link href="/" className="block">
                  <h3 className="text-[25px] font-Poppins uppercase dark:text-white text-black">
                    E-Learning
                  </h3>
                </Link>
                <IconButton
                  onClick={() => setIsCollapsed(true)}
                  className="inline-block"
                >
                  <ArrowBackIosIcon className="text-black dark:text-[#ffffffc1]" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box sx={{ mb: "25px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  alt="profile-user"
                  width={100}
                  height={100}
                  loading="eager"
                  src={resolveNonEmpty(
                    user?.avatar?.url,
                    "https://res.cloudinary.com/kouroshrstn/image/upload/v1707293133/Avatars/avatar_dwjgxo.png"
                  )}
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                    border: "3px solid #5b6fe6",
                  }}
                />
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  className="text-[20px]! text-black dark:text-[#ffffffc1]"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user?.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ m: "10px 0 0 0" }}
                  className="text-[20px]! text-black dark:text-[#ffffffc1] capitalize"
                >
                  - {user?.role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box sx={{ paddingLeft: isCollapsed ? undefined : "10%" }}>
            <Item
              title="Dashboard"
              to="/admin"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 25px" }}
              className="text-[18px]! text-black dark:text-[#ffffffc1] capitalize font-normal!"
            >
              {!isCollapsed && "Data"}
            </Typography>
            <Item
              title="Users"
              to="/admin/users"
              icon={<GroupsIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Invoices"
              to="/admin/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              className="text-[18px]! text-black dark:text-[#ffffffc1] capitalize font-normal!"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Content"}
            </Typography>
            <Item
              title="Create Course"
              to="/admin/create-course"
              icon={<VideoCallIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Live Courses"
              to="/admin/courses"
              icon={<OndemandVideoIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              className="text-[18px]! text-black dark:text-[#ffffffc1] capitalize font-normal!"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Customization"}
            </Typography>
            <Item
              title="Hero"
              to="/admin/hero"
              icon={<WebIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ"
              to="/admin/faq"
              icon={<QuizIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Categories"
              to="/admin/categories"
              icon={<WysiwygIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              className="text-[18px]! text-black dark:text-[#ffffffc1] capitalize font-normal!"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Controllers"}
            </Typography>
            <Item
              title="Manage Team"
              to="/admin/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              className="text-[18px]! text-black dark:text-[#ffffffc1] capitalize font-normal!"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Analytics"}
            </Typography>
            <Item
              title="Courses Analytics"
              to="/admin/courses-analytics"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Orders Analytics"
              to="/admin/orders-analytics"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Users Analytics"
              to="/admin/users-analytics"
              icon={<ManageHistoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              className="text-[18px]! text-black dark:text-[#ffffffc1] capitalize font-normal!"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Extras"}
            </Typography>
            <Item
              title="Logout"
              to="/"
              icon={<ExitToAppIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
