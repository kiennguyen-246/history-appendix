import "@/styles/globals.css";

import Head from "next/head";

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Thuật ngữ lịch sử</title>
                <meta name="charset" content="utf-8" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
