import Image from "next/image";
import { useState, useEffect } from "react";
import { groupBy } from "lodash";

import UnAuthLayout from "@/layouts/UnAuth";

const menus = [
  {
    key: 1,
    title: "Store",
  },
  {
    key: 2,
    title: "Product",
  },
  {
    key: 3,
    title: "Business",
  },
  {
    key: 4,
    title: "Education",
  },
  {
    key: 5,
    title: "Support",
  },
  {
    key: 6,
    title: "Events",
  },
];

const laptopsHeader = [
  {
    key: 1,
    title: "Gaming",
    description: "Laptops built to level up, grind, and conquer all.",
  },
  {
    key: 2,
    title: "Switf",
    description: "The thin and light ultrabook to get things swiftly done.",
  },
  {
    key: 3,
    title: "Aspire",
    description: "The original and all-inclusive day-to-dayer.",
  },
  {
    key: 4,
    title: "Nitro",
    description:
      "Hit turbo and go full speed. Fast displays and undeniable performance await you.",
  },
  {
    key: 5,
    title: "TravelMate",
    description:
      "Lightweight, long-lasting laptops built to flexibly adapt to and excel in new hybrid work and learning styles.",
  },
];

const laptopsItems = [
  {
    key: 1,
    title: "Gaming",
    description: "Laptops built to level up, grind, and conquer all.",
    price: 1,
    isSoldOut: true,
    series: "Switf",
  },
  {
    key: 2,
    title: "Switf",
    description: "The thin and light ultrabook to get things swiftly done.",
    price: 2,
    isSoldOut: false,
    series: "Switf",
  },
  {
    key: 3,
    title: "Aspire",
    description: "The original and all-inclusive day-to-dayer.",
    price: 3,
    isSoldOut: false,
    series: "Switf",
  },
  {
    key: 4,
    title: "Nitro",
    description:
      "Hit turbo and go full speed. Fast displays and undeniable performance await you.",
    price: 4,
    isSoldOut: true,
    series: "Switf",
  },
  {
    key: 5,
    title: "TravelMate",
    description:
      "Lightweight, long-lasting laptops built to flexibly adapt to and excel in new hybrid work and learning styles.",
    price: 5,
    isSoldOut: true,
    series: "Aspire",
  },
  {
    key: 6,
    title: "Gaming",
    description: "Laptops built to level up, grind, and conquer all.",
    price: 6,
    isSoldOut: true,
    series: "Aspire",
  },
  {
    key: 7,
    title: "Switf",
    description: "The thin and light ultrabook to get things swiftly done.",
    price: 7,
    isSoldOut: false,
    series: "Aspire",
  },
  {
    key: 8,
    title: "Aspire",
    description: "The original and all-inclusive day-to-dayer.",
    price: 8,
    isSoldOut: true,
    series: "Aspire",
  },
  {
    key: 9,
    title: "Nitro",
    description:
      "Hit turbo and go full speed. Fast displays and undeniable performance await you.",
    price: 9,
    isSoldOut: true,
    series: "Nitro",
  },
  {
    key: 10,
    title: "TravelMate",
    description:
      "Lightweight, long-lasting laptops built to flexibly adapt to and excel in new hybrid work and learning styles.",
    price: 10,
    isSoldOut: true,
    series: "Nitro",
  },
];
const DigitsForm = () => {
  const groupByLaptopSeries = groupBy(laptopsItems, "series");
  const [listItem, setListItem] = useState(laptopsItems);
  const [toggleSoldOut, setToggleSoldOut] = useState(true);
  useEffect(() => {
    setListItem(
      laptopsItems.filter((laptop) => laptop.isSoldOut === toggleSoldOut),
    );
  }, [toggleSoldOut]);

  const handleOnSelectSoldOut = () => {
    setToggleSoldOut(!toggleSoldOut);
  };
  return (
    <UnAuthLayout>
      {/*Menus Block*/}
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-1">
          <Image src={"/assets/images/acer-4.svg"} width={100} height={100} />
        </div>
        <div className="col-span-4 flex space-x-6 justify-center items-center">
          {menus.map((menu) => (
            <p className="font-bold text-center" key={menu.key}>
              {menu.title}
            </p>
          ))}
        </div>
        <div className="col-span-1 flex justify-center items-center">
          <p>Search</p>
        </div>
      </div>

      {/*Header Laptops Block*/}
      <div className="grid grid-cols-4 gap-4 px-8 bg-slate-100">
        {laptopsHeader.map((laptop) => (
          <div className="justify-center items-center" key={laptop.key}>
            <div className="flex justify-center items-center">
              <Image
                src={"/assets/images/laptop.jpeg"}
                width={200}
                height={150}
              />
            </div>
            <div>
              <p className="font-bold text-center my-6">{laptop.title}</p>
              <p className="font-medium text-center my-4">
                {laptop.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/*Body Block*/}
      <div>
        <p className="font-bold text-center my-6 text-4xl">
          Find your perfect Acer laptop
        </p>
        <p className="font-medium text-center my-4 text-2xl">
          Search and compare products by features and specs to find your perfect
          Acer laptop
        </p>
        <div className="grid grid-cols-4 gap-4 px-8">
          <div className="col-span-1">
            <p className="font-bold">Filters</p>
            <div className="border-t-2">
              <div className="flex my-6">
                <input
                  type="checkbox"
                  id="vehicle1"
                  name="vehicle1"
                  value="Bike"
                  onChange={handleOnSelectSoldOut}
                />
                <p className="mx-2">{`Sold On Acer Store (${
                  laptopsItems.filter((laptop) => !laptop.isSoldOut).length
                })`}</p>
              </div>
            </div>
            <div className="border-t-2">
              <p className="my-2 font-bold">By Series</p>
              <div className="my-6">
                {Object.keys(groupByLaptopSeries).map((series, idx) => (
                  <div key={idx} className="flex my-2">
                    <input
                      type="checkbox"
                      id="vehicle1"
                      name="vehicle1"
                      value="Bike"
                    />
                    <p className="mx-2">{`${series} (${
                      groupByLaptopSeries[`${series}`]?.length
                    })`}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <div className="grid grid-cols-3 gap-4">
              {listItem.map((laptop) => (
                <div className="col-span-1 border-2 hover:shadow">
                  <div className="flex justify-center items-center">
                    <Image
                      src={"/assets/images/laptop.jpeg"}
                      width={200}
                      height={150}
                    />
                  </div>
                  <p className="text-center my-2">{laptop.title}</p>
                  <div className="flex justify-center items-center">
                    <button className="w-[100px] h-[50px] my-2 bg-[#80c343] hover:bg-[#ffffff] hover:border-[#80c343] hover:border-2">
                      {laptop.isSoldOut ? (
                        <p className="text-center font-bold">Explore</p>
                      ) : (
                        <p className="text-center font-bold">Add to Cart</p>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </UnAuthLayout>
  );
};

DigitsForm.public = true;

export default DigitsForm;
