import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/features/store";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: Readonly<ProvidersProps>) {
  return <Provider store={store}>{children}</Provider>;
}
