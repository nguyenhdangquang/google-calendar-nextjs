/* eslint-disable @next/next/no-img-element */
import { ReactNode, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  HomeIcon,
  UserIcon,
  LogoutIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/outline";
import Avatar from "react-avatar";
import { Toaster } from "react-hot-toast";
import { logout, getUserProfile } from "@/features/user/authSlice";
import { AppDispatch, RootState } from "@/store/store";

import ModalAlert from "@/components/ModalAlert";
import CalendarPageSideBarItems from "@/components/CalendarPageSideBarItems";
import SettingPagesSideBarItems from "@/components/SettingPagesSideBarItems";
import Link from "next/link";

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [show, setShow] = useState(false);
  const [showModalAlert, toogleModalAlert] = useState(false);

  // Selector
  const selectorUserInfo = useSelector(
    (state: RootState) => state.authReducer?.profile?.data,
  );
  const selectorListCalendars = useSelector(
    (state: RootState) => state.calendarReducer.listingCalendar.calendars,
  );

  const availableCalendars = selectorListCalendars.filter((c) => !c.isDisabled);

  useEffect(() => {
    if (!selectorUserInfo) {
      dispatch(getUserProfile()).then((data) => {
        if ((data as any).payload?.statusCode === 401) {
          dispatch(logout());
        }
      });
    }
  }, [dispatch, selectorUserInfo]);

  const isHomepage = router.route === "/";
  const isSettingsPage = router.route?.includes("/settings");

  const handleLogout = () => {
    dispatch(logout());
    toogleModalAlert(false);
    router.push("/login");
  };

  return (
    <div className="w-full px-1 text-gray-700 antialiased">
      {props.meta}
      <div className="xs:w-full h-screen md:hidden flex justify-center items-center">
        <h2 className="text-zenith-black font-semibold">
          Not yet supported to display on mobile
        </h2>
      </div>

      <div className="w-full h-full bg-gray-200 hidden md:block">
        <div className="flex flex-no-wrap">
          {/* Sidebar starts */}
          <div className="absolute lg:relative h-full-screen w-1/3 bg-zenith-stone-50 hidden lg:block">
            <button
              onClick={() => router.push("/")}
              className="h-16 w-full flex items-center pr-8 pl-4"
            >
              <img
                className="h-8"
                src={`/assets/images/ZenithBetaBlack.svg`}
                alt="Zenith"
              />
            </button>

            <div className="py-6 px-6">
              <div className="flex -space-x-1 overflow-hidden items-center">
                <Avatar
                  size="60"
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                  src={selectorUserInfo?.avatarUrl}
                  name={`${selectorUserInfo?.firstName} ${selectorUserInfo?.lastName}`}
                />

                <div className="flex flex-col items-start pl-6">
                  <p className="text-zenith-black font-semibold">
                    {selectorUserInfo?.firstName} {selectorUserInfo?.lastName}
                  </p>
                  {availableCalendars.length === 0 ? (
                    <Link href="/settings/manage-calendars">
                      <span className="text-zenith-black font-light text-sm hover:cursor-pointer hover:underline underline-offset-2">
                        Manage calendars
                      </span>
                    </Link>
                  ) : (
                    <span className="text-zenith-black font-light text-sm">
                      {availableCalendars.length} calendars connected
                    </span>
                  )}
                </div>
              </div>
              {isHomepage && <CalendarPageSideBarItems />}

              {isSettingsPage && <SettingPagesSideBarItems />}
            </div>
          </div>

          {/*Mobile responsive sidebar*/}
          <div
            className={
              show
                ? "w-full h-full absolute z-40  transform  translate-x-0 "
                : "   w-full h-full absolute z-40  transform -translate-x-full"
            }
            id="mobile-nav"
          >
            <div
              className="bg-gray-800 opacity-50 absolute h-full w-full lg:hidden"
              onClick={() => setShow(!show)}
            />
            <div className="absolute z-40 sm:relative w-64 md:w-96 pb-4 bg-gray-100 lg:hidden transition duration-150 ease-in-out h-full">
              <div className="flex flex-col justify-between h-full w-full">
                <div>
                  <div className="flex items-center justify-between px-8">
                    <div className="h-16 w-full flex items-center">
                      <img src={`/assets/images/logo.svg`} alt="Zenith" />
                    </div>
                    <div
                      id="closeSideBar"
                      className="flex items-center justify-center h-10 w-10"
                      onClick={() => setShow(!show)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-x"
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <line x1={18} y1={6} x2={6} y2={18} />
                        <line x1={6} y1={6} x2={18} y2={18} />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="border-t border-gray-300">
                    <div className="w-full flex items-center justify-between px-6 pt-1">
                      <ul className="flex">
                        <li className="cursor-pointer text-white pt-5 pb-3">
                          <HomeIcon className="h-5 w-5 text-zenith-black"></HomeIcon>
                        </li>
                        <li className="cursor-pointer text-white pt-5 pb-3 pl-3">
                          <QuestionMarkCircleIcon className="h-5 w-5 text-zenith-black"></QuestionMarkCircleIcon>
                        </li>
                        <li className="cursor-pointer text-white pt-5 pb-3 pl-3">
                          <UserIcon className="h-5 w-5 text-zenith-black"></UserIcon>
                        </li>
                        <li className="cursor-pointer text-white pt-5 pb-3 pl-3">
                          <LogoutIcon className="h-5 w-5 text-zenith-black"></LogoutIcon>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Mobile responsive sidebar*/}
          {/* Sidebar ends */}

          <div className="w-full bg-white">
            {/* Navigation starts */}
            <nav className="h-16 flex items-center lg:items-stretch justify-end lg:justify-between bg-white relative z-10">
              <div className="hidden lg:flex w-full pr-6">
                <div className="w-1/2 h-full hidden lg:flex items-center pl-6 pr-24"></div>
                <div className="w-1/2 hidden lg:flex">
                  <div className="w-full flex items-center pl-8 justify-end">
                    <button
                      onClick={() => router.push("/")}
                      className="ml-8 w-20 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 text-base font-medium text-zenith-black hover:font-bold"
                    >
                      Home
                    </button>

                    <button className="ml-8 w-20 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 text-base font-medium text-zenith-black hover:font-bold">
                      Help
                    </button>

                    <button
                      onClick={() => router.push("/settings/profile")}
                      className={`ml-8 w-20 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 text-base text-zenith-black hover:font-bold ${
                        router.route.includes("/settings")
                          ? "font-bold"
                          : "font-medium"
                      }`}
                    >
                      Account
                    </button>

                    <button
                      onClick={() => toogleModalAlert(true)}
                      className="ml-8 w-20 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 text-base font-medium text-zenith-black hover:font-bold"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="text-gray-600 mr-8 visible lg:hidden relative"
                onClick={() => setShow(!show)}
              >
                {show ? (
                  " "
                ) : (
                  <svg
                    aria-label="Main Menu"
                    aria-haspopup="true"
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-menu cursor-pointer"
                    width={30}
                    height={30}
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <line x1={4} y1={8} x2={20} y2={8} />
                    <line x1={4} y1={16} x2={20} y2={16} />
                  </svg>
                )}
              </div>
            </nav>
            {/* Navigation ends */}

            {/* Remove class [ h-64 ] when adding a card block */}
            <div className="container w-full px-6 py-6">
              {/* Remove class [ border-dashed border-2 border-gray-300 ] to remove dotted border */}
              <div className="w-full h-full rounded border-gray-300">
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster />

      <ModalAlert
        title="Log Out"
        content="Are you sure you want to log out?"
        isOpen={showModalAlert}
        setIsOpen={toogleModalAlert}
        loading={false}
        onClickConfirm={handleLogout}
      />
    </div>
  );
};

export { Main };
