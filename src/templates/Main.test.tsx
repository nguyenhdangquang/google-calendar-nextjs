import { render, screen } from "@testing-library/react";

import { Main } from "./Main";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { environment_config } from "@/services/env-variables";

const AUTH_GOOGLE_CLIENT_ID = environment_config.AUTH_GOOGLE_CLIENT_ID;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderWithRedux = (component: any) => {
  return {
    ...render(
      <Provider store={store}>
        <GoogleOAuthProvider clientId={AUTH_GOOGLE_CLIENT_ID}>
          {component}
        </GoogleOAuthProvider>
      </Provider>,
    ),
    store,
  };
};

xdescribe("Main template", () => {
  describe("Render method", () => {
    // it("should have 3 menu items", () => {
    //   render(<Main meta={null}>{null}</Main>);

    //   const menuItemList = screen.getAllByRole("listitem");

    //   expect(menuItemList).toHaveLength(3);
    // });

    it("should have logo", () => {
      renderWithRedux(<Main meta={null}>{null}</Main>);

      const logoSection = screen.getByRole("logo");
      // const copyrightSection = screen.getByText(/© Copyright/);
      // const copyrightLink = within(copyrightSection).getByRole("link");

      /*
       * PLEASE READ THIS SECTION
       * We'll really appreciate if you could have a link to our website
       * The link doesn't need to appear on every pages, one link on one page is enough.
       * Thank you for your support it'll mean a lot for us.
       */
      expect(logoSection).toHaveAttribute("src", "/assets/images/logo.svg");
    });
  });
});
