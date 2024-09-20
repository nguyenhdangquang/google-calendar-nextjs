import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function UnAuthLayout(props: { children: ReactNode }) {
  return (
    <>
      <main>{props.children}</main>
    </>
  );
}
