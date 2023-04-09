import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>
                    Marketo Error Handling | Removed Unused Meta Tags and Fix
                    Duplicate IDs
                </title>
            </Head>
            <Component {...pageProps} />
        </>
    );
}
