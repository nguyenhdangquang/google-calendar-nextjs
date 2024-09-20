import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
// import { ExclamationCircleIcon } from "@heroicons/react/outline";

interface ModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  loading: boolean;
  setIsOpen: (value: boolean) => void;
  onClickConfirm: () => void;
}

export default function ModalAlert(props: ModalProps) {
  const { isOpen, setIsOpen, title, content, onClickConfirm, loading } = props;

  function closeModal() {
    setIsOpen(false);
  }

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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex flex-row items-center text-lg font-medium leading-6 text-zenith-black mb-5"
                  >
                    {/* <ExclamationCircleIcon className="w-6 h-6 text-red-850 mr-2" /> */}
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-zenith-black">{content}</p>
                  </div>

                  <div className="w-full inline-flex justify-end mt-4 space-x-4">
                    <button
                      type="button"
                      disabled={loading}
                      className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-zenith-black focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      <span className="underline underline-offset-1">
                        Cancel
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-850 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      onClick={onClickConfirm}
                    >
                      {!loading && <span>Confirm</span>}
                      {loading && (
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
