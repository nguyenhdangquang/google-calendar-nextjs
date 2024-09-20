import { useState } from "react";

import UnAuthLayout from "@/layouts/UnAuth";

// Page should have a simple form
// this should contain a number field
// and a submit button
// Upon submit button click
// should generate a summation of even digits
// if you 5
// 0 + 2 + 4 > 6
// if it s 6
// 12
const DigitsForm = () => {
  const [digit, setDigit] = useState(0);
  const [t, setT] = useState("0");

  const onChangeInput = (e: any) => {
    return setDigit(e.currentTarget.value);
  };

  const onSubmit = () => {
    console.log("haha");
    if (digit % 2 > 0) {
      const a = Math.floor(digit / 2);
      let string = "0";
      for (let i = 0; i + 1; i < a) {
        string += i + 2;
      }
      setT(string);
    }
  };

  return (
    <UnAuthLayout>
      <form className="w-3/4 md:w-1/2 space-y-6" action="#" onSubmit={onSubmit}>
        <input
          id="digit-input-id"
          type="text"
          placeholder=""
          onChange={onChangeInput}
          className={"border bg-neutral-50"}
        />
        <p>{`Number field: ${t}`}</p>
        <button type="submit">Submit</button>
      </form>
    </UnAuthLayout>
  );
};

DigitsForm.public = true;

export default DigitsForm;
