import React, { Fragment, useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { SketchPicker, ColorResult } from "react-color";
import { Menu, Transition } from "@headlessui/react";

interface ColorPickerProps {
  color?: string;
  onChangeValue?: (value: any) => void;
}

const defaultColor = "#050404";

const DropdownColorPicker = (props: ColorPickerProps) => {
  const { onChangeValue, color } = props;

  const [selectedColor, setSelectColor] = useState(defaultColor);

  useEffect(() => {
    setSelectColor(color || defaultColor);
    if (onChangeValue) {
      onChangeValue(color || defaultColor);
    }
  }, [onChangeValue, color]);

  const handleChangeColor = (color: ColorResult) => {
    setSelectColor(color.hex);
    if (onChangeValue) {
      onChangeValue(color.hex);
    }
  };

  return (
    <>
      <Menu
        as="div"
        className="w-full z-10 relative inline-block text-left space-y-1"
      >
        <label className="text-sm text-zenith-black">Calendar colour</label>
        <div>
          <Menu.Button className="inline-flex w-full justify-between items-center border rounded-md bg-white px-4 py-2 text-sm font-semibold text-zenith-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <div className="inline-flex items-center">
              <div
                style={{ backgroundColor: selectedColor }}
                className="w-4 h-4 mr-3 rounded-sm"
              ></div>
              {selectedColor}
            </div>
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 text-zenith-black"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                <SketchPicker
                  color={selectedColor}
                  onChange={handleChangeColor}
                />
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default DropdownColorPicker;
