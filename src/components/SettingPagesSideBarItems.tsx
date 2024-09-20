import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Tab } from "@headlessui/react";

const SettingPagesSideBarItems = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    switch (router.route) {
      case "/settings/change-password":
        setSelectedIndex(1);
        break;
      // case "/settings/connect-calendar":
      //   setSelectedIndex(3);
      //   break;
      case "/settings/manage-calendars":
        setSelectedIndex(3);
        break;
      default:
        setSelectedIndex(0);
    }
  }, [router.route]);

  const onChangeTab = (value: number) => {
    switch (value) {
      case 1:
        return router.push("/settings/change-password");
      // case 3:
      //   return router.push("/settings/connect-calendar");
      case 3:
        return router.push("/settings/manage-calendars");
      default:
        return router.push("/settings/profile");
    }
  };

  return (
    <div className="flex flex-col py-10">
      <span className="text-lg text-zenith-black font-semibold">
        User Settings
      </span>

      <Tab.Group selectedIndex={selectedIndex} onChange={onChangeTab}>
        <Tab.List className="flex flex-col pt-3">
          <Tab
            className={({ selected }) =>
              `w-full h-10 px-3 rounded-md text-left text-zenith-black text-sm font-semibold focus:outline-none ${
                selected ? "bg-zenith-gray-50" : "bg-transparent"
              }`
            }
          >
            Edit Profile
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full h-10 px-3 rounded-md text-left text-zenith-black text-sm font-semibold focus:outline-none ${
                selected ? "bg-zenith-gray-50" : "bg-transparent"
              }`
            }
          >
            Change password
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full h-10 px-3 rounded-md text-left text-zenith-black text-sm font-semibold focus:outline-none ${
                selected ? "bg-zenith-gray-50" : "bg-transparent"
              }`
            }
          >
            Upgrades
          </Tab>

          <span className="text-lg text-zenith-black font-semibold py-3">
            Calendar Settings
          </span>
          {/* 
          <Tab
            className={({ selected }) =>
              `w-full h-10 px-3 rounded-md text-left text-zenith-black text-sm font-semibold focus:outline-none ${
                selected ? "bg-zenith-gray-50" : "bg-transparent"
              }`
            }
          >
            Connect Calendar
          </Tab> */}

          <Tab
            className={({ selected }) =>
              `w-full h-10 px-3 rounded-md text-left text-zenith-black text-sm font-semibold focus:outline-none ${
                selected ? "bg-zenith-gray-50" : "bg-transparent"
              }`
            }
          >
            Manage Calendars
          </Tab>
        </Tab.List>
      </Tab.Group>
    </div>
  );
};

export default SettingPagesSideBarItems;
