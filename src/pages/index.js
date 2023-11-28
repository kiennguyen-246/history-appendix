import Image from "next/image";
import { Inter, Vollkorn } from "next/font/google";
import { Body } from "./components";

const inter = Inter({ subsets: ["latin"] });
const vollkorn = Vollkorn({ subsets: ["vietnamese"] });

export default function Home() {
    return (
        <div className="wrap bg-[#FED38F]">
            <Body />
        </div>
    );
}
