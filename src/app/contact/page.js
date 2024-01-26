"use client";

import { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { Montserrat } from "next/font/google";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Image from "next/image";
import "dotenv/config";

const FEEDBACK_API = "/api/feedback";
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
    const [largeViewport, setLargeViewport] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;
        setLargeViewport(window.innerWidth > 650);
        window.addEventListener("resize", () => {
            setLargeViewport(window.innerWidth > 650);
        });
        return () =>
            window.removeEventListener("resize", () => {
                setLargeViewport(window.innerWidth > 650);
            });
    }, []);

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
                                        className="inline-flex items-end border-b-2 border-transparent px-6 pt-1 pb-8 text-lg font-bold rounded-b-3xl bg-violet-700 text-white "
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
        { name: "Từ điển", href: "dict", current: false },
        { name: "Thông tin", href: "#", current: false },
        { name: "Liên hệ", href: "contact", current: true },
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
    return (
        <div>
            <div className="w-full bg">
                <h2 className="my-4 font-bold text-violet-800 text-4xl">
                    Góp ý với chúng tôi
                </h2>
                <form
                    onSubmit={async (event) => {
                        event.preventDefault();
                        const email = event.target.email.value;
                        const feedback = event.target.feedback.value;
                        if (feedback.length > 10000) {
                            alert(
                                "Giới hạn là 10000 ký tự. Vui lòng trình bày ngắn gọn hơn."
                            );
                        } else {
                            const httpResponse = await fetch(FEEDBACK_API, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    email,
                                    feedback,
                                }),
                            });
                            alert(
                                "Ý kiến của bạn đã được ghi nhận.\nCảm ơn bạn đã góp ý!"
                            );
                        }
                    }}
                >
                    <label
                        htmlFor="email"
                        className={`${montserrat.className} mt-1 block text-base font-bold text-gray-700`}
                    >
                        Email
                    </label>
                    <div className="mt-2">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="block w-full py-3 pl-3 pr-10 rounded-md bg-gray-200 border border-transparent text-lg border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-sans"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <label
                        htmlFor="feedback"
                        className={`${montserrat.className} mt-4 block text-base font-bold text-gray-700`}
                    >
                        Bạn muốn chia sẻ điều gì?
                    </label>
                    <div className="mt-2">
                        <textarea
                            rows="15"
                            name="feedback"
                            id="feedback"
                            placeholder="Đóng góp tại đây..."
                            className="block w-full py-3 pl-3 pr-10 rounded-md bg-gray-200 border border-transparent text-lg border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-sans"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 md-4 float-right w-1/10 items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-violet-800 hover:bg-violet-700 focus:outline-none font-sans"
                    >
                        Ghi nhận
                    </button>
                </form>
            </div>
        </div>
    );
}
