import { SetStateAction, useState } from "react";
import dynamic from "next/dynamic";

function Home() {
    const [inputCode, setInputCode] = useState("");
    const [errorCode, setErrorCode] = useState("");
    const [outputCode, setOutputCode] = useState("");
    const [errorsRemoved, setErrorsRemoved] = useState<number>(0);

    const ids: any[] = [];

    const CC = dynamic(
        () =>
            import("@/components/clipboard/CopyClipboard").then(
                (mod) => mod.CopyClipboard
            ),
        { ssr: false }
    );

    const handleInputChange = (event: {
        target: { value: SetStateAction<string> };
    }) => {
        setInputCode(event.target.value);
    };
    const handleErrorChange = (event: {
        target: { value: SetStateAction<string> };
    }) => {
        setErrorCode(event.target.value);
    };

    const handleSubmit = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        const lines = errorCode.split("\n");
        console.log(lines);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith("Warning: Unused Variable: ")) {
                const id = line.substring(25).trim();
                ids.push(id);
            }
        }
        console.log(ids);
        setErrorsRemoved(ids.length);
        const pattern = new RegExp(
            `<meta[^>]+id="(${ids.join("|")})"[^>]*>`,
            "g"
        );
        const processedCode = inputCode
            .replace(pattern, "")
            .replace(/^\s*\n/gm, "");
        setOutputCode(processedCode);
    };

    return (
        <main className="bg-slate-100 min-h-screen px-[10vw] py-12">
            <h1 className="font-extrabold text-center text-6xl pb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-center leading-tight">
                    Quickly Remove Unused Meta Tags <br />
                    from Marketo Email Templates
                </span>{" "}
                🚀
            </h1>
            <form onSubmit={handleSubmit}>
                <div className="top pt-4">
                    <div className="flex gap-5">
                        <div className="flex flex-col w-full">
                          <div className="pb-2">
                            <label className="font-semibold" htmlFor="input">
                                Paste Your Original HTML Code:
                            </label>
                          </div>
                            <textarea
                                className="p-1 min-h-[300px] max-h-[300px] w-full border-slate-500 border-2 resize-none rounded-md"
                                rows={10}
                                placeholder="Paste your code here"
                                id="input"
                                name="input"
                                value={inputCode}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex flex-col w-full">
                          <div className="pb-2">

                            <label
                                className="font-semibold"
                                htmlFor="inputErrors">
                                Paste In The Marketo Errors:
                            </label>
                          </div>
                            <textarea
                                className="p-1 min-h-[300px] max-h-[300px] w-full border-slate-500 border-2 resize-none rounded-md"
                                rows={10}
                                placeholder="Paste your Marketo errors here"
                                id="inputErrors"
                                name="inputErrors"
                                value={errorCode}
                                onChange={handleErrorChange}
                            />
                        </div>
                    </div>
                    <button
                        className="bg-blue-600 px-3 py-1 mt-3 rounded-md text-white text-2xl hover:bg-blue-700"
                        type="submit">
                        Process
                    </button>
                </div>
                {outputCode && <div className="bottom pt-5">
                    <div>
                        <div>                            
                            <div className="pb-1">
                            <label className="font-semibold" htmlFor="output">
                                Output code:
                            </label>
                            </div>
                        </div>
                        <textarea
                            className="p-1 h-full max-h-[300px] w-full border-slate-500 border-2 resize-none rounded-md"
                            rows={10}
                            id="output"
                            name="output"
                            value={outputCode}
                            readOnly
                        />
                    </div>
                    <div className="flex gap-2 bg-slate-200 w-fit p-2 rounded-lg items-center my-3">
                                <CC content={outputCode} />
                                <p className="font-semibold">
                                    👈 Click to copy output code to clipboad
                                </p>
                            </div>
                    <div className="errors">
                        Unused Meta Tags Removed:{" "}
                        <span
                            className={`${
                                errorsRemoved > 0 && "font-semibold"
                            }`}>
                            {errorsRemoved}
                        </span>
                        {errorsRemoved > 0 && <span> 😱</span>}
                    </div>
                </div>}
                
            </form>
        </main>
    );
}

export default Home;

// export default function Home() {

//     return (
//         <main>
//             <div className="paste flex justify-around flex-wrap px-[10vw]">
//                 <div className="col w-full max-w-[500px]">
//                   <h2 className="text-2xl font-semibold pb-3">Paste your code here:</h2>
//                   <textarea className="p-1 min-h-[300px] max-h-[300px] w-full border-slate-500 border-2 resize-none rounded-md" rows={10} placeholder="Paste your code here"></textarea>
//                 </div>
//                 <div className="col w-full max-w-[500px]">
//                 <h2 className="text-2xl font-semibold pb-3">Paste your Marketo Errors here:</h2>
//                 <textarea className="p-1 min-h-[300px] max-h-[300px] w-full border-slate-500 border-2 resize-none rounded-md" rows={10} placeholder="Paste your Marketo Errors here"></textarea>
//                 </div>
//             </div>
//         </main>
//     );
// }
