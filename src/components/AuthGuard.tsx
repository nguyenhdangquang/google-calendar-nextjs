import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);

  // Selector
  const accessToken = useSelector(
    (state: RootState) => state.authReducer?.accessToken,
  );

  useEffect(() => {
    setTimeout(() => {
      setInitializing(false);
    }, 1000);

    if (!initializing) {
      // const { calendarId, email, timeline } = router?.query;
      // if (calendarId && email && timeline && router?.pathname === "/meeting") {
      //   return;
      // }
      if (!accessToken) {
        // redirect
        router.push("/login");
      }
    }
  }, [initializing, accessToken, router]);

  /* show loading indicator while the auth provider is still initializing */
  if (initializing) {
    return (
      <div
        id="loading-screen"
        className="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50"
      >
        <span className="text-green-500 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0">
          <svg
            className="animate-spin -ml-1 mr-3 h-10 w-10 text-zenith-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      </div>
    );
  }

  // if auth initialized with a valid user show protected page
  if (!initializing && accessToken) {
    return <>{children}</>;
  }

  /* otherwise don't return anything, will do a redirect from useEffect */
  return null;
}
