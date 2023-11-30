import { useState } from "react";
import { Combobox } from "@headlessui/react";

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
    const [feedbackFormDisplay, setfeedbackFormDisplay] = useState(false);

    const doSetQuery = async () => {
        setFound(false);
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

    return (
        <div className="container m-auto max-w-3xl font-['vollkorn']">
            <Heading />
            <SearchArea onSubmit={onSearch} />
            <Content init={init} found={found} response={response} />
            <FeeabackArea feedbackFormDisplay={feedbackFormDisplay} />
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

function Content({ init, found, response }) {
    if (!init) {
        return <EmptyContent />;
    } else if (found) {
        return <KeywordContent response={response} />;
    } else {
        return <NotFound />;
    }
}

function EmptyContent() {
    return <div>Hãy thử nhập một từ khoá để tìm kiếm.</div>;
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

function FeeabackArea({ feedbackFormDisplay }) {
    if (!feedbackFormDisplay) {
        return <></>;
    }
    return (
        <div className="mt-10 w-full bg">
            <h2 className="font-bold text-green-800 text-4xl"> Góp ý</h2>
            <form
                onSubmit={async (event) => {
                    event.preventDefault();
                    const email = event.target.email.value;
                    const feedback = event.target.feedback.value;
                    const httpResponse = await fetch(FEEDBACK_API, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, feedback }),
                    });
                    alert(
                        "Ý kiến của bạn đã được ghi nhận.\nCảm ơn bạn đã góp ý!"
                    );
                }}
            >
                <label
                    htmlFor="email"
                    className="mt-1 block text-base font-bold text-gray-700"
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
                    className="mt-1 block text-base font-bold text-gray-700"
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
                    className="mt-2 w-1/10 items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-lime-800 hover:bg-lime-700 focus:outline-none font-sans"
                >
                    Ghi nhận
                </button>
            </form>
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
