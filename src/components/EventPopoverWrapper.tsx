// import { useState, Fragment, useEffect } from "react";
// import { Transition } from "@headlessui/react";
// import { Popover } from "react-tiny-popover";
// // import { Event, EventWrapperProps } from "react-big-calendar";

export default function EventPopoverWrapper() {
  // const [open, setOpen] = useState(false);
  // const [eventDivHeight, setEventDivHeight] = useState(0);
  // // console.log("props.event:: ", props?.event);
  // useEffect(() => {
  //   const eventDiv = document.getElementsByClassName((props?.event as any)?.id);
  //   if (eventDiv.length) {
  //     const { height } = eventDiv.item(0)?.getBoundingClientRect();
  //     setEventDivHeight(height);
  //     console.log("height:: ", height);
  //   }
  // }, [props?.event]);
  // return (
  //   <>
  //     <Popover
  //       isOpen={open}
  //       padding={eventDivHeight / 2}
  //       positions={["right"]}
  //       onClickOutside={() => setOpen(false)}
  //       content={() => (
  //         <Transition
  //           as={Fragment}
  //           enter="transition ease-out duration-200"
  //           enterFrom="opacity-0 translate-y-1"
  //           enterTo="opacity-100 translate-y-0"
  //           leave="transition ease-in duration-150"
  //           leaveFrom="opacity-100 translate-y-0"
  //           leaveTo="opacity-0 translate-y-1"
  //           show={open}
  //         >
  //           <div className="z-50">
  //             <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
  //               <div className="bg-gray-50 p-4">
  //                 <a
  //                   href="##"
  //                   className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
  //                 >
  //                   <span className="flex items-center">
  //                     <span className="text-sm font-medium text-gray-900">
  //                       Documentation
  //                     </span>
  //                   </span>
  //                   <span className="block text-sm text-gray-500">
  //                     Start integrating products and tools
  //                   </span>
  //                 </a>
  //               </div>
  //             </div>
  //           </div>
  //         </Transition>
  //       )}
  //     >
  //       <span onClick={() => setOpen(!open)}>{props?.title}</span>
  //     </Popover>
  //   </>
  // );
}
