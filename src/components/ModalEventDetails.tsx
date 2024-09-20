import { Fragment, useRef, useState, useEffect, Key } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Event } from "react-big-calendar";
import {
  XIcon,
  // TrashIcon,
  MenuAlt2Icon,
  CalendarIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import dayjs from "dayjs";
import Avatar from "react-avatar";
import { sortBy } from "lodash";

interface ModalProps {
  isOpen: boolean;
  loading: boolean;
  event: Event | null;
  setIsOpen: (value: boolean) => void;
  onSave: (event: Event) => void;
}

export default function ModalEventDetails(props: ModalProps) {
  const { isOpen, setIsOpen, event, loading, onSave } = props;
  const editorRef = useRef<any>();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [eventTitle, setEventTitle] = useState<any>();
  const [eventDesc, setEventDesc] = useState<string>();
  const [showEditor, setShowEditor] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    setEventTitle(event?.title);
    setEventDesc(event?.resource?.description);
  }, [event]);

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorLoaded(true);
  }, []);

  function closeModal() {
    if (!loading) {
      setIsOpen(false);
    }
    setShowEditor(false);
  }

  const onClickSave = () => {
    const newEvent = {
      ...event,
      title: eventTitle,
      resource: {
        ...event?.resource,
        description: eventDesc,
      },
    };
    onSave(newEvent);
  };

  const isSameDay = dayjs(event?.start).isSame(event?.end, "day");
  const attendees = sortBy(event?.resource?.attendees, ["organizer"]) || [];
  const hasDescription = event?.resource?.description;

  useEffect(() => {
    if (isOpen && hasDescription) {
      setShowEditor(true);
    }
  }, [hasDescription, isOpen]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-10" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all space-y-5">
                  <Dialog.Title
                    as="h3"
                    className="flex flex-row items-center justify-end text-lg font-medium leading-6 text-zenith-black mb-5 space-x-6"
                  >
                    {/* <button className="focus:outline-none">
                      <TrashIcon className="w-5 h-5 text-zenith-black" />
                    </button> */}

                    <button className="focus:outline-none" onClick={closeModal}>
                      <XIcon className="w-5 h-5 text-zenith-black" />
                    </button>
                  </Dialog.Title>

                  <div className="flex flex-row items-center space-x-4">
                    <div
                      style={{ ...event?.resource?.style }}
                      className="w-4 h-4 rounded-sm mb-4"
                    ></div>
                    <div className="flex flex-col w-4/5 space-y-2">
                      <input
                        type="text"
                        className="text-lg font-semibold text-zenith-black focus:outline-none border-b border-zenith-gray-50 focus:border-zenith-black"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.currentTarget.value)}
                      />

                      {Boolean(event?.allDay) ? (
                        <div className="items-center text-sm text-zenith-black">
                          {dayjs(event?.start).format("dddd, MMMM D")}{" "}
                        </div>
                      ) : isSameDay ? (
                        <div className="items-center text-sm text-zenith-black">
                          {dayjs(event?.start).format("dddd, MMMM D")}{" "}
                          <span className="font-semibold mx-2 my-0">.</span>{" "}
                          {dayjs(event?.start).format("HH")}
                          {" - "}
                          {dayjs(event?.end).format("HH:mm:a")}
                        </div>
                      ) : (
                        <span className="text-sm text-zenith-black">
                          {dayjs(event?.start).format("MMMM DD, YYYY HH:mm:a")}{" "}
                          - {dayjs(event?.end).format("MMMM DD, YYYY HH:mm:a")}
                        </span>
                      )}

                      {/* {isSameDay ? (
                        <div className="items-center text-sm text-zenith-black">
                          {dayjs(event?.start).format("dddd, MMMM D")}{" "}
                          <span className="font-semibold mx-2 my-0">.</span>{" "}
                          {dayjs(event?.start).format("HH")}
                          {" - "}
                          {dayjs(event?.end).format("HH:mm:a")}
                        </div>
                      ) : (
                        <span className="text-sm text-zenith-black">
                          {dayjs(event?.start).format("MMMM DD, YYYY HH:mm:a")}{" "}
                          - {dayjs(event?.end).format("MMMM DD, YYYY HH:mm:a")}
                        </span>
                      )} */}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 max-w-md overflow-hidden">
                    <div className="flex flex-row items-center space-x-4">
                      <MenuAlt2Icon className="w-4 h-4 text-zenith-black font-semibold" />
                      {!showEditor && (
                        <span
                          onClick={() => setShowEditor(true)}
                          className="px-3 py-2 rounded-md text-sm font-semibold text-zenith-gray-100 hover:cursor-pointer hover:bg-zenith-gray-50"
                        >
                          Add description
                        </span>
                      )}

                      {editorLoaded && showEditor && (
                        <CKEditor
                          className="max-w-sm"
                          editor={ClassicEditor}
                          data={eventDesc}
                          disabled={loading}
                          onReady={(editor: any) => {
                            // You can store the "editor" and use when it is needed.
                            console.log("Editor is ready to use!", editor);
                          }}
                          onChange={(
                            _event: any,
                            editor: { getData: () => any },
                          ) => {
                            const data = editor.getData();
                            setEventDesc(data);
                            // console.log({ event, editor, data });
                          }}
                        />
                      )}
                    </div>

                    {attendees.length > 0 && (
                      <div className="flex flex-row items-start space-x-4">
                        <UsersIcon className="w-4 h-4 text-zenith-black font-semibold" />
                        <div className="flex flex-col space-y-2">
                          <span className="text-sm text-zenith-black">
                            {attendees.length} guest
                          </span>

                          {attendees.map(
                            (item: any, index: Key | null | undefined) => (
                              <div key={index} className="space-x-2">
                                <Avatar
                                  size="25"
                                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                  name={item?.email}
                                />

                                <span className="text-xs text-zenith-black">
                                  {item?.email}{" "}
                                  {item?.organizer ? "(Organizer)" : ""}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-row items-center space-x-4">
                      <CalendarIcon className="w-4 h-4 text-zenith-black font-semibold" />
                      <span className="text-sm text-zenith-black">
                        {event?.resource?.calendar?.name}
                      </span>
                    </div>
                  </div>

                  <div className="w-full inline-flex justify-end mt-4 space-x-4">
                    {/* <button
                      type="button"
                      disabled={loading}
                      className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-zenith-black focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      <span className="underline underline-offset-1">
                        Cancel
                      </span>
                    </button> */}

                    <button
                      type="button"
                      disabled={loading}
                      className="inline-flex justify-center w-20 rounded-md border border-transparent bg-red-850 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      onClick={onClickSave}
                    >
                      {!loading && <span>Save</span>}
                      {loading && (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
