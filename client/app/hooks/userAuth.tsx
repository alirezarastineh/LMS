import { useSelector } from "react-redux";

export default function UserAuth() {
  const { user } = useSelector((state: any) => state.auth);

  return user ? true : false;
}
