"use client";

import { useState, useEffect, Fragment } from "react";
import { Montserrat } from "next/font/google";
import { Disclosure, Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Image from "next/image";
import "dotenv/config";

const GET_ALL_API = "/api/getall";
const SEARCH_API = "/api/search";
const montserrat = Montserrat({ subsets: ["vietnamese"] });

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
    const [largeViewport, setLargeViewport] = useState(window.innerWidth > 650);

    const updateMedia = () => {
        setLargeViewport(window.innerWidth > 650);
    };

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    });

    return (
        <div
            className={`${montserrat.className} container m-auto max-w-4xl px-2`}
        >
            <Navbar largeViewport={largeViewport} />
            <div className="content-wrap m-auto max-w-2xl">
                <Content />
                <div style={{ marginTop: "6rem" }}>.</div>
            </div>
        </div>
    );
}

function Navbar({ largeViewport }) {
    if (largeViewport) {
        return <HNav />;
    } else {
        return <VNav />;
    }
}

function HNav() {
    return (
        <header className="border-b-2 border-gray-500 mb-20">
            <Disclosure as="nav" className="pb-4">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-28 justify-between">
                                <div className="flex flex-shrink-0 items-end">
                                    <Image
                                        className="hidden h-20 w-auto lg:block"
                                        src="/logo.png"
                                        width={132}
                                        height={60}
                                        alt="Logo"
                                    />
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                                    {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                                    <a
                                        href="home"
                                        className="inline-flex items-end border-b-2 border-transparent px-6 pt-1 pb-8 text-lg font-bold rounded-b-3xl text-gray-500 hover:bg-gray-300 hover:text-gray-700"
                                    >
                                        Trang chủ
                                    </a>
                                    <a
                                        href="dict"
                                        className="inline-flex items-end border-b-2 border-transparent px-6 pt-1 pb-8 text-lg font-bold rounded-b-3xl bg-violet-700 text-white"
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

function VNav() {
    const [menuDisplay, setMenuDisplay] = useState(false);

    const navigation = [
        { name: "Trang chủ", href: "home", current: false },
        { name: "Từ điển", href: "dict", current: true },
        { name: "Thông tin", href: "#", current: false },
        { name: "Liên hệ", href: "contact", current: false },
    ];
    return (
        <div className="border-b-2 border-gray-500 mb-10">
            <div className="flex h-16 justify-between">
                <div className="flex flex-shrink-0 items-end">
                    <Image
                        className=" h-16 w-auto lg:block"
                        src="/logo.png"
                        width={132}
                        height={60}
                        alt="Logo"
                    />
                </div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setMenuDisplay(!menuDisplay);
                    }}
                >
                    <Bars3Icon className="h-6 w-6 float-right" />
                </button>
            </div>

            {menuDisplay && (
                <nav className="space-y-1" aria-label="Sidebar">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                                item.current
                                    ? "bg-violet-700 text-white"
                                    : "text-gray-500 hover:bg-gray-300 hover:text-gray-700",
                                "flex items-center px-3 py-2 text-sm font-bold"
                            )}
                            aria-current={item.current ? "page" : undefined}
                        >
                            <span className="truncate">{item.name}</span>
                        </a>
                    ))}
                </nav>
            )}
        </div>
    );
}

function Content() {
    const [dict, setDict] = useState(null);
    const [open, setOpen] = useState(false);
    const [info, setInfo] = useState(null);

    useEffect(() => {
        fetch(GET_ALL_API)
            .then((res) => res.json())
            .then((data) => {
                setDict(data.data);
            });
    }, []);
    const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (dict == null) return <div>Đang tải...</div>;
    return (
        <div>
            {alphabet.split("").map((letter) => {
                if (dict[letter] == undefined) return null;
                return (
                    <>
                        <div className="text-4xl font-bold text-violet-700 my-2 border-b-2">
                            {letter}
                        </div>
                        <div className="my-2 mb-4 ">
                            {dict &&
                                dict[letter] &&
                                dict[letter].map((item) => {
                                    return (
                                        <a
                                            key={letter}
                                            onClick={() => {
                                                setOpen(true);
                                                const response = fetch(
                                                    SEARCH_API,
                                                    {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type":
                                                                "application/json",
                                                        },
                                                        body: JSON.stringify({
                                                            keyword:
                                                                item.keyword,
                                                        }),
                                                    }
                                                )
                                                    .then((res) => res.json())
                                                    .then((data) => {
                                                        setInfo(data.data);
                                                        console.log(data);
                                                    });
                                                console.log(info);
                                            }}
                                            className="text-xl font-bold text-gray-500 hover:text-gray-900 my-2"
                                        >
                                            {item.keyword}
                                            <br />
                                        </a>
                                    );
                                })}
                        </div>
                    </>
                );
            })}
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                                    <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={() => {
                                                setOpen(false);
                                                setInfo(null);
                                            }}
                                        >
                                            <span className="sr-only">
                                                Close
                                            </span>
                                            <XMarkIcon
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                    {info == null ? (
                                        <div className={montserrat.className}>
                                            Đang tải ...
                                        </div>
                                    ) : (
                                        <div className="sm:flex sm:items-start">
                                            <div
                                                className={`${montserrat.className} mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left font-['montserrat']`}
                                            >
                                                <div className="mt-2">
                                                    <h2 className="font-bold text-violet-800 text-4xl">
                                                        {info.keyword}
                                                    </h2>
                                                    <p className="text-xl mt-6 font-bold">
                                                        Trang {info.pagenumber}{" "}
                                                        | Chủ đề {info.topic} |
                                                        Sách {info.bookname}
                                                    </p>
                                                    <p className="text-lg mt-6">
                                                        {info == null
                                                            ? ""
                                                            : info.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
}
