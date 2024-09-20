import { useState, Fragment, useEffect } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { Listbox, Transition } from "@headlessui/react";

interface ListBoxProps {
  data: DataProps[];
  label?: string;
  zIndex?: number;
  defaultData: DataProps | null;
  onChangeValue?: (value: any) => void;
}

type DataProps = {
  id: string | number;
  name: string;
  value?: string | number;
};

const ListBox = (props: ListBoxProps) => {
  const { data, label, onChangeValue, zIndex = 1, defaultData } = props;
  const [selectedData, setSelectedData] = useState(data[0]);

  useEffect(() => {
    if (defaultData) {
      setSelectedData(defaultData);
    } else {
      setSelectedData(data[0]);
    }
    if (onChangeValue) {
      onChangeValue(
        defaultData ? defaultData : data?.length > 0 ? data[0] : null,
      );
    }
  }, [data, onChangeValue, defaultData]);

  const onChange = (value: any) => {
    setSelectedData(value);
    if (onChangeValue) {
      onChangeValue(value);
    }
  };

  return (
    <Listbox value={selectedData} onChange={onChange}>
      {label && (
        <Listbox.Label className="text-sm text-zenith-black">
          {label}:
        </Listbox.Label>
      )}
      <div className={`relative mt-1`} style={{ zIndex }}>
        <Listbox.Button className="relative border w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="text-zenith-black font-semibold block truncate">
            {selectedData?.name}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon
              className="h-5 w-5 text-zenith-black"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {data.map((item, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active
                      ? "bg-zenith-stone-100 text-amber-900"
                      : "text-gray-900"
                  }`
                }
                value={item}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-semibold" : "font-normal"
                      }`}
                    >
                      {item.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default ListBox;
