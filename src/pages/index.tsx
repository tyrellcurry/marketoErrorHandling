import { SetStateAction, useState } from "react";
import dynamic from "next/dynamic";
import Switch from "@mui/material/Switch";

function Home() {
    const [inputCode, setInputCode] = useState("");
    const [errorCode, setErrorCode] = useState("");
    const [hasDuplicateID, setHasDuplicateID] = useState<boolean>(false);
    const [outputCode, setOutputCode] = useState("");
    const [errorsRemoved, setErrorsRemoved] = useState<number>(0);
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const label = { inputProps: { "aria-label": "Switch demo" } };

    const unusedIds: any[] = [];
    const duplicateIds: any[] = [];

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
        target: { value: SetStateAction<any> };
    }) => {
        const newErrorCode = event.target.value;
        setErrorCode(newErrorCode);
        setHasDuplicateID(newErrorCode.includes("Duplicate Element Id"));
    };

    const handleSubmit = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        const lines = errorCode.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith("Warning: Unused Variable: ")) {
                const id = line.substring(25).trim();
                unusedIds.push(id);
            } else if (line.startsWith("Error: Duplicate Element Id: ")) {
                let id = line.substring(25).trim();
                const prefix = "Id: ";
                const index = id.indexOf(prefix);
                if (index !== -1) {
                    id = id.substring(index + prefix.length);
                }
                duplicateIds.push(id);
            }
        }
        setErrorsRemoved(unusedIds.length);
        const pattern = new RegExp(
            `<meta[^>]+id="(${unusedIds.join("|")})"[^>]*>`,
            "g"
        );
        let processedCode = inputCode
            .replace(pattern, "")
            .replace(/^\s*\n/gm, "");

        const uniqueDuplicateIds = duplicateIds.filter((item, index) => {
            return duplicateIds.indexOf(item) === index;
        });

        setOutputCode(processedCode);
    };
    const handleCheckboxChange = (event: {
        target: { checked: boolean | ((prevState: boolean) => boolean) };
    }) => {
        setIsChecked(event.target.checked);
    };

    console.log(hasDuplicateID);

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
                                <label
                                    className="font-semibold"
                                    htmlFor="input">
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
                                className="p-1 min-h-[300px] max-h-[300px] w-full border-slate-500 border-2 resize-none rounded-md focus:rounded-md"
                                rows={10}
                                placeholder="Paste your Marketo errors here"
                                id="inputErrors"
                                name="inputErrors"
                                value={errorCode}
                                onChange={handleErrorChange}
                            />
                        </div>
                    </div>
                    {hasDuplicateID && (
                        <div className="pt-4">
                            <p>
                                It looks like you have some duplicate ID's in
                                your code.
                            </p>
                            <p>Would you like to fix this?</p>
                            <div className="mt-2 flex items-center">
                                <Switch
                                    className="-ml-3"
                                    {...label}
                                    onChange={handleCheckboxChange}
                                />
                                <p>{isChecked ? "Yes" : "No"}</p>
                            </div>
                            {isChecked && (
                                <div className="pt-2 pb-1">
                                    <p className="text-xl pb-1 font-semibold">
                                        Great 🙌!
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <p>
                                            Customize what to append the
                                            Duplicate ID:
                                        </p>
                                        <input
                                            className="px-1 w-full max-w-[100px] border-slate-500 border-2 rounded-md"
                                            placeholder="Eg. _two"
                                        />
                                    </div>
                                    <p>
                                        If you leave this blank, the default
                                        that will be{" "}
                                        <span className="font-semibold">
                                            _two
                                        </span>
                                        .
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        className="bg-blue-600 px-3 py-1 mt-3 rounded-md text-white text-2xl hover:bg-blue-700"
                        type="submit">
                        Process
                    </button>
                </div>
                {outputCode && (
                    <div className="bottom pt-5">
                        <div>
                            <div>
                                <div className="pb-1">
                                    <label
                                        className="font-semibold"
                                        htmlFor="output">
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
                    </div>
                )}
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
