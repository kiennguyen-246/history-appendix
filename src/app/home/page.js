"use client";

import { useState, Fragment } from "react";
import { Combobox } from "@headlessui/react";
import { Dialog, Transition, Disclosure, Menu } from "@headlessui/react";
import {
    MagnifyingGlassIcon,
    BellIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Asap } from "next/font/google";
import "dotenv/config";

const SEARCH_API = "/api/search";
const FILTER_API = "/api/filter";
const FEEDBACK_API = "/api/feedback";
const asap = Asap({ subsets: ["vietnamese"] });

export default function Home() {
    return (
        <div className="wrap">
            <Body />
        </div>
    );
}

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function Body() {
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
        <div className="container m-auto max-w-4xl font-['montserrat']">
            <Navbar />
            <div className="content-wrap m-auto max-w-2xl">
                <SearchArea onSubmit={onSearch} />
                <Content
                    init={init}
                    found={found}
                    pending={pending}
                    response={response}
                />
                <div style={{ marginTop: "6rem" }}>.</div>
            </div>
        </div>
    );
}

function Navbar() {
    return (
        <header className="border-b-2 border-gray-500 mb-20">
            <Disclosure as="nav" className="pb-4">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-28 justify-between">
                                <div className="flex flex-shrink-0 items-end">
                                    <img
                                        className="block h-28 w-auto lg:hidden"
                                        src="logo.png"
                                        alt="Logo"
                                    />
                                    <img
                                        className="hidden h-28 w-auto lg:block"
                                        src="logo.png"
                                        alt="Logo"
                                    />
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                                    {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                                    <a
                                        href="home"
                                        className="inline-flex items-end border-b-2 border-transparent px-6 pt-1 pb-8 text-lg font-bold rounded-b-3xl bg-violet-700 text-white "
                                    >
                                        Trang chủ
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex items-end border-b-2 border-transparent px-6 pt-1 pb-8 text-lg font-bold rounded-b-3xl text-gray-500 hover:bg-gray-300 hover:text-gray-700"
                                    >
                                        Từ điển
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex items-end border-b-2 border-transparent px-6 pt-1 pb-8 text-lg font-bold rounded-b-3xl text-gray-500 hover:bg-gray-300 hover:text-gray-700"
                                    >
                                        Thông tin
                                    </a>
                                    <a
                                        href="contact"
                                        className="inline-flex items-end border-b-2 border-transparent px-6 pt-1 pb-8 text-lg font-bold rounded-b-3xl text-gray-500 hover:bg-gray-300 hover:text-gray-700"
                                    >
                                        Liên hệ
                                    </a>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Disclosure>
        </header>
    );
}

function SearchArea({ onSubmit }) {
    return (
        <div className="">
            <form className="search-area" onSubmit={onSubmit}>
                <SearchBox />
                <SearchButton />
            </form>
        </div>
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
            className={"inline-block w-11/12"}
        >
            <div className="relative w-full">
                <Combobox.Input
                    className={`${asap.className} w-full h-16 border border-transparent text-lg text-gray-600 border-gray-300 bg-gray-200 pt-3 pl-3 pr-10 shadow-sm focus:border-none focus:outline-none focus:ring-0`}
                    id="searchInput"
                    placeholder="Nhập từ khoá..."
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
                                            ? "bg-violet-800 text-white"
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
                                                        : "text-violet-800"
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
        <div className="inline-block w-1/12">
            <button
                type="submit"
                className="search-button w-full h-16 items-center px-4 border border-transparent shadow-sm text-base font-medium text-black bg-gray-200 hover:bg-gray-100 focus:outline-none font-sans"
            >
                <MagnifyingGlassIcon className="h-6 w-6 float-right" />
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
    return <div></div>;
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
            <h2 className="font-bold text-violet-800 text-4xl mt-10">
                {response.keyword}
            </h2>
            <p className="text-xl mt-6 font-bold">
                Trang {response.pagenumber} | Chủ đề {response.topic} | Sách{" "}
                {response.bookname}
            </p>
            <p className="text-xl mt-6">{response.content}</p>
        </div>
    );
}
