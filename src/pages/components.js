import { useState, Fragment } from "react";
import { Combobox } from "@headlessui/react";
import { Dialog, Transition } from "@headlessui/react";
import { InboxIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { set } from "lodash";

const SEARCH_API = "http://localhost:3000/api/search";
const FILTER_API = "http://localhost:3000/api/filter";
const FEEDBACK_API = "http://localhost:3000/api/feedback";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export function Body() {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState(null);
    const [init, setInit] = useState(false);
    const [found, setFound] = useState(false);
    const [pending, setPending] = useState(false);
    const [feedbackFormDisplay, setfeedbackFormDisplay] = useState(false);

    const doSetQuery = async () => {
        setFound(false);
        setPending(true);
        const inputValue = document.getElementById("searchInput").value;
        setQuery(inputValue);
    };

    const searchKeyword = async () => {
        const inputValue = document.getElementById("searchInput").value;
        const httpResponse = await fetch(SEARCH_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ keyword: inputValue }),
        });
        const json = await httpResponse.json();
        if (json.status == 200) {
            setFound(true);
            setResponse(json.data);
        } else {
            setFound(false);
            setResponse(null);
        }
        setPending(false);
    };

    const onSearch = (event) => {
        event.preventDefault();
        doSetQuery()
            .then(searchKeyword)
            .then(async () => {
                setInit(true);
            })
            .then(async () => {
                console.log(init, found, response);
            });
    };

    const showFeedback = () => {
        setfeedbackFormDisplay(true);
    };

    const closeFeedback = () => {
        setfeedbackFormDisplay(false);
    };

    return (
        <div className="container m-auto max-w-3xl font-['vollkorn']">
            <Heading />
            <SearchArea onSubmit={onSearch} />
            <Content
                init={init}
                found={found}
                pending={pending}
                response={response}
            />
            <FeedbackArea
                feedbackFormDisplay={feedbackFormDisplay}
                closeFeedback={closeFeedback}
            />
            <div style={{ marginTop: "6rem" }}>.</div>
            <Footer showFeedback={showFeedback} />
        </div>
    );
}

function Heading() {
    return (
        <h1 className="text-lime-800 text-6xl font-bold text-center m-5">
            Tra cứu thuật ngữ lịch sử
        </h1>
    );
}

function SearchArea({ onSubmit }) {
    return (
        <form className="search-area" onSubmit={onSubmit}>
            <SearchBox />
            <SearchButton />
        </form>
    );
}

function SearchBox() {
    const [query, setQuery] = useState("");
    const [selectedKeyword, setSelectedKeyword] = useState(null);
    const [filteredkeyword, setFilteredkeyword] = useState([]);

    return (
        <Combobox
            as="div"
            value={selectedKeyword}
            onChange={setSelectedKeyword}
            className={"inline-block w-5/6"}
        >
            <div className="relative mt-1 w-full">
                <Combobox.Input
                    className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-lime-700 focus:outline-none focus:ring-1 focus:ring-lime-700 sm:text-sm font-sans"
                    id="searchInput"
                    onChange={async (event) => {
                        event.preventDefault();
                        setSelectedKeyword(null);
                        setQuery(event.target.value);
                        const htmlResponse = await fetch(FILTER_API, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ query: event.target.value }),
                        });
                        const json = await htmlResponse.json();
                        console.log(event.target.value);
                        setFilteredkeyword(json.data);
                        console.log(json.data);
                    }}
                    displayValue={(selectedKeyword) => {
                        return selectedKeyword
                            ? selectedKeyword.keyword
                            : query;
                    }}
                />
                {filteredkeyword.length > 0 && (
                    <Combobox.Options className="absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm font-sans">
                        {filteredkeyword.map((Keyword) => (
                            <Combobox.Option
                                key={Keyword.id}
                                value={Keyword}
                                className={({ active }) =>
                                    classNames(
                                        "relative cursor-default select-none py-2 pl-3 pr-9",
                                        active
                                            ? "bg-lime-800 text-white"
                                            : "text-gray-900"
                                    )
                                }
                            >
                                {({ active, selected }) => (
                                    <>
                                        <span
                                            className={classNames(
                                                "block truncate",
                                                selected && "font-semibold"
                                            )}
                                        >
                                            {Keyword.keyword}
                                        </span>

                                        {selected && (
                                            <span
                                                className={classNames(
                                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                                    active
                                                        ? "text-white"
                                                        : "text-lime-800"
                                                )}
                                            ></span>
                                        )}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                )}
            </div>
        </Combobox>
    );
}

function SearchButton({ onButtonClick }) {
    return (
        <div className="inline-block w-1/6">
            <button
                type="submit"
                className="search-button items-center ml-2 px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-lime-800 hover:bg-lime-700 focus:outline-none font-sans"
            >
                Tìm
            </button>
        </div>
    );
}

function Content({ init, found, pending, response }) {
    if (!init) {
        return <EmptyContent />;
    } else if (pending) {
        return <PendingContent />;
    } else if (found) {
        return <KeywordContent response={response} />;
    } else {
        return <NotFound />;
    }
}

function EmptyContent() {
    return <div>Hãy thử nhập một từ khoá để tìm kiếm.</div>;
}

function PendingContent() {
    return (
        <div>
            <p>Đang tìm kiếm...</p>
        </div>
    );
}

function NotFound() {
    return (
        <div>
            <p>Không tìm thấy kết quả</p>
        </div>
    );
}

function KeywordContent({ response }) {
    return (
        <div>
            <h2 className="font-bold text-green-800 text-4xl mt-10">
                {response.keyword}
            </h2>
            <p className="text-xl mt-2">{response.content}</p>
            <p className="italic text-gray-500 text-xl mt-2">
                Tham khảo thêm tại trang {response.pageNumber}, chủ đề{" "}
                {response.topic}, sách {response.bookName}.
            </p>
        </div>
    );
}

function Footer({ showFeedback }) {
    return (
        <footer className="bg-black fixed left-0 right-0 bottom-0 w-full text-center">
            <div className="mx-auto max-w-4xl py-8 px-6">
                <p className="text-center text-small leading-5 text-white">
                    Các từ khoá được tham khảo từ các sách giáo khoa của NXB
                    Giáo dục Việt Nam.
                </p>
                <a
                    href="#"
                    className="text-blue-500 underline underline-offset-1"
                    onClick={showFeedback}
                >
                    Góp ý với chúng tôi.
                </a>
            </div>
        </footer>
    );
}

export default function FeedbackArea({ feedbackFormDisplay, closeFeedback }) {
    return (
        <Transition.Root show={feedbackFormDisplay} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeFeedback}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        onClick={() => closeFeedback()}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                                <div className="sm:block sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-3xl pt-3 font-bold leading-6 text-lime-900 font-[vollkorn]"
                                        >
                                            Góp ý
                                        </Dialog.Title>
                                        <div className="mt-5 w-full bg">
                                            <form
                                                onSubmit={async (event) => {
                                                    event.preventDefault();
                                                    const email =
                                                        event.target.email
                                                            .value;
                                                    const feedback =
                                                        event.target.feedback
                                                            .value;
                                                    const httpResponse =
                                                        await fetch(
                                                            FEEDBACK_API,
                                                            {
                                                                method: "POST",
                                                                headers: {
                                                                    "Content-Type":
                                                                        "application/json",
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        email,
                                                                        feedback,
                                                                    }
                                                                ),
                                                            }
                                                        );
                                                    alert(
                                                        "Ý kiến của bạn đã được ghi nhận.\nCảm ơn bạn đã góp ý!"
                                                    );
                                                    closeFeedback();
                                                }}
                                            >
                                                <label
                                                    htmlFor="email"
                                                    className="mt-1 block text-base font-bold text-gray-700 font-[vollkorn]"
                                                >
                                                    Email
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-sans"
                                                        placeholder="Email"
                                                        required
                                                    />
                                                </div>
                                                <label
                                                    htmlFor="feedback"
                                                    className="mt-1 block text-base font-bold text-gray-700 font-[vollkorn]"
                                                >
                                                    Nội dung
                                                </label>
                                                <div className="mt-1">
                                                    <textarea
                                                        rows="4"
                                                        name="feedback"
                                                        id="feedback"
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-sans"
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="mt-4 md-4 float-right w-1/10 items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-lime-800 hover:bg-lime-700 focus:outline-none font-sans"
                                                >
                                                    Ghi nhận
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
