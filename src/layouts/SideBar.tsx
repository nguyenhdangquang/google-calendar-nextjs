/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  HomeIcon,
  UserIcon,
  LogoutIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/outline";
import { logout } from "@/features/user/authSlice";
import { AppDispatch } from "@/store/store";

export default function SideBar() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <>
      <div className="w-full h-full bg-gray-200">
        <div className="flex flex-no-wrap">
          {/* Sidebar starts */}
          <div className="absolute lg:relative w-96 h-screen bg-gray-100 hidden lg:block">
            <div className="h-16 w-full flex items-center px-8">
              <img src={`/assets/images/logo.svg`} alt="Zenith" />
            </div>

            <ul className=" py-6">
              <li className="pl-6 cursor-pointer text-sm leading-3 tracking-normal pb-4 pt-5 text-indigo-700 focus:text-indigo-700 focus:outline-none">
                <div className="flex items-center">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-grid"
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
                      <rect x={4} y={4} width={6} height={6} rx={1} />
                      <rect x={14} y={4} width={6} height={6} rx={1} />
                      <rect x={4} y={14} width={6} height={6} rx={1} />
                      <rect x={14} y={14} width={6} height={6} rx={1} />
                    </svg>
                  </div>
                  <span className="ml-2">Dashboard</span>
                </div>
              </li>
              <li className="pl-6 cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mt-4 mb-4 py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-puzzle"
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
                    <path d="M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1" />
                  </svg>
                  <span className="ml-2">Products</span>
                </div>
              </li>
              <li className="pl-6 cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mb-4 py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-compass"
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
                    <polyline points="8 16 10 10 16 8 14 14 8 16" />
                    <circle cx={12} cy={12} r={9} />
                  </svg>
                  <span className="ml-2">Performance</span>
                </div>
              </li>
              <li className="pl-6 cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-code"
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
                    <polyline points="7 8 3 12 7 16" />
                    <polyline points="17 8 21 12 17 16" />
                    <line x1={14} y1={4} x2={10} y2={20} />
                  </svg>
                  <span className="ml-2">Deliverables</span>
                </div>
              </li>
            </ul>
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
                  <ul className=" py-6">
                    <li className="pl-6 cursor-pointer text-sm leading-3 tracking-normal pb-4 pt-5 text-indigo-700 focus:text-indigo-700 focus:outline-none">
                      <div className="flex items-center">
                        <div className="w-6 h-6 md:w-8 md:h-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-grid"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <rect x={4} y={4} width={6} height={6} rx={1} />
                            <rect x={14} y={4} width={6} height={6} rx={1} />
                            <rect x={4} y={14} width={6} height={6} rx={1} />
                            <rect x={14} y={14} width={6} height={6} rx={1} />
                          </svg>
                        </div>
                        <span className="ml-2 xl:text-base md:text-2xl text-base">
                          Dashboard
                        </span>
                      </div>
                    </li>
                    <li className="pl-6 cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mt-4 mb-4 py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                      <div className="flex items-center">
                        <div className="w-6 h-6 md:w-8 md:h-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-puzzle"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1" />
                          </svg>
                        </div>
                        <span className="ml-2 xl:text-base md:text-2xl text-base">
                          Products
                        </span>
                      </div>
                    </li>
                    <li className="pl-6 cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mb-4 py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                      <div className="flex items-center">
                        <div className="w-6 h-6 md:w-8 md:h-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-compass"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <polyline points="8 16 10 10 16 8 14 14 8 16" />
                            <circle cx={12} cy={12} r={9} />
                          </svg>
                        </div>
                        <span className="ml-2 xl:text-base md:text-2xl text-base">
                          Performance
                        </span>
                      </div>
                    </li>
                    <li className="pl-6 cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                      <div className="flex items-center">
                        <div className="w-6 h-6 md:w-8 md:h-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-code"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <polyline points="7 8 3 12 7 16" />
                            <polyline points="17 8 21 12 17 16" />
                            <line x1={14} y1={4} x2={10} y2={20} />
                          </svg>
                        </div>
                        <span className="ml-2 xl:text-base md:text-2xl text-base">
                          Deliverables
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="w-full">
                  <div className="border-t border-gray-300">
                    <div className="w-full flex items-center justify-between px-6 pt-1">
                      {/* <div className="flex items-center">
                        <img
                          alt="profile-pic"
                          src="https://tuk-cdn.s3.amazonaws.com/assets/components/boxed_layout/bl_1.png"
                          className="w-8 h-8 rounded-md"
                        />
                        <p className="md:text-xl text-gray-800 text-base leading-4 ml-2">
                          Jane Doe
                        </p>
                      </div> */}
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

          <div className="w-full">
            {/* Navigation starts */}
            <nav className="h-16 flex items-center lg:items-stretch justify-end lg:justify-between bg-white relative z-10">
              <div className="hidden lg:flex w-full pr-6">
                <div className="w-1/2 h-full hidden lg:flex items-center pl-6 pr-24">
                  {/* <div className="relative w-full">
                    <div className="text-gray-500 absolute ml-4 inset-0 m-auto w-4 h-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-search"
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <circle cx={10} cy={10} r={7} />
                        <line x1={21} y1={21} x2={15} y2={15} />
                      </svg>
                    </div>
                    <input
                      className="border border-gray-100 focus:outline-none focus:border-indigo-700 rounded w-full text-sm text-gray-500 bg-gray-100 pl-12 py-2"
                      type="text"
                      placeholder="Search"
                    />
                  </div> */}
                </div>
                <div className="w-1/2 hidden lg:flex">
                  <div className="w-full flex items-center pl-8 justify-end">
                    <button className="ml-8 w-20 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 text-base font-medium text-zenith-black hover:font-bold">
                      Home
                    </button>

                    <button className="ml-8 w-20 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 text-base font-medium text-zenith-black hover:font-bold">
                      Help
                    </button>

                    <button className="ml-8 w-20 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 text-base font-medium text-zenith-black hover:font-bold">
                      Account
                    </button>

                    <button
                      onClick={handleLogout}
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
            <div className="container mx-auto py-10 h-64 md:w-4/5 w-11/12 px-6">
              {/* Remove class [ border-dashed border-2 border-gray-300 ] to remove dotted border */}
              <div className="w-full h-full rounded border-dashed border-2 border-gray-300">
                {/* Place your content here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
