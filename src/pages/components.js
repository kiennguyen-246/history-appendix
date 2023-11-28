import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { removeTone } from "./utils";

const keyword = [
    {
        id: 1,
        name: "cách mạng tư sản",
        content:
            "Cuộc cách mạng do giai cấp tư sản (hay quý tộc mới) lãnh đạo nhằm lật đổ chế độ phong kiến, thiết lập nền thống trị của giai cấp tư sản, mở đường cho sự phát triển của chủ nghĩa tư bản, theo học thuyết Mác.",
        pageNumber: 4,
        topic: 1,
        textbook: "Lịch sử 11 (Cánh diều)",
    },
    {
        id: 2,
        name: "chủ nghĩa tư bản",
        content:
            "Là một hệ thống kinh tế dựa trên quyền sở hữu tư nhân đối với tư liệu sản xuất và hoạt động sản xuất vì lợi nhuận.",
        pageNumber: 4,
        topic: 1,
        textbook: "Lịch sử 11 (Cánh diều)",
    },
    {
        id: 3,
        name: "Đồng minh",
        content:
            "Liên minh chính trị, quân sự quốc tế được thành lập trong Chiến tranh thế giới thứ hai, đứng đầu là Mỹ, Liên Xô, Anh nằm chiến đấu chống chủ nghĩa phát xít.",
        pageNumber: 37,
        topic: 3,
        textbook: "Lịch sử 11 (Cánh diều)",
    },
    // More users...
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export function Body() {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState(null);
    const [init, setInit] = useState(false);
    const [found, setFound] = useState(false);

    const doSetQuery = async () => {
        setFound(false);
        const inputValue = document.getElementById("searchInput").value;
        setQuery(inputValue);
    };

    const searchKeyword = async () => {
        const inputValue = document.getElementById("searchInput").value;
        for (let i = 0; i < keyword.length; i++) {
            if (keyword[i].name === inputValue) {
                setFound(true);
                setResponse(keyword[i]);
                break;
            }
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

    return (
        <div className="container m-auto max-w-3xl font-['vollkorn']">
            <Heading />
            <SearchArea onSubmit={onSearch} />
            <Content init={init} found={found} response={response} />
            <ExtraContent />
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

    const filteredkeyword =
        query === ""
            ? keyword
            : keyword.filter((Keyword) => {
                  return removeTone(Keyword.name)
                      .toLowerCase()
                      .includes(removeTone(query).toLowerCase());
              });

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
                    onChange={(event) => {
                        event.preventDefault();
                        setQuery(event.target.value);
                    }}
                    displayValue={(selectedKeyword) => {
                        return selectedKeyword ? selectedKeyword.name : query;
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
                                            {Keyword.name}
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
                {response.name}
            </h2>
            <p className="text-xl mt-2">{response.content}</p>
            <p className="italic text-gray-500 text-xl mt-2">
                Tham khảo thêm tại trang {response.pageNumber}, chủ đề{" "}
                {response.topic}, sách {response.textbook}.
            </p>
        </div>
    );
}

function ExtraContent() {
    return (
        <div>
            <p className="mt-20 text-small">
                Các từ khoá được tham khảo từ các sách giáo khoa của NXB Giáo
                dục Việt Nam. Liên hệ với chúng tôi tại đây.
            </p>
        </div>
    );
}
