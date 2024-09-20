import { render, screen } from "@testing-library/react";

import CreateNewPassword from "@/pages/create-new-password";
import { Provider } from "react-redux";
import { store } from "../store/store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderWithRedux = (component: any) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

test("load and displays create new password page", async () => {
  renderWithRedux(<CreateNewPassword />);

  await screen.findByRole("heading", { name: "Create new password" });
});
