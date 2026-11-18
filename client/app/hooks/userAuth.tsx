import { useSelector } from "react-redux";
import type { RootState } from "@/redux/features/store";

export default function UserAuth() {
  const { user } = useSelector((state: RootState) => state.auth);

  return Boolean(user);
}
