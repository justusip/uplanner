import {MdClose} from "react-icons/md";
import React from "react";
import cx from "classnames";

export default function Popup(props: React.PropsWithChildren<{
    showed: boolean,
    setShowed: (showed: boolean) => void,
    title: string
    classNames?: any
    fixed?: boolean
}>) {

    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape")
                props.setShowed(false);
        };
        window.addEventListener("keydown", handler);
        return () => {
            window.removeEventListener("keydown", handler);
        };
    }, []);
    return <>
        {
            props.showed &&
            <div className={"absolute inset-0 z-10 bg-black/50 flex place-items-center place-content-center p-8"}
                 onClick={() => props.setShowed(false)}>
                <div
                    className={cx(
                        "w-full max-w-[600px] overflow-hidden bg-gray-800 flex flex-col border border-gray-500",
                        props.fixed && "h-full max-h-[400px]"
                    )}
                    onClick={e => e.stopPropagation()}>
                    <div className={"p-2 flex place-items-center gap-2 text-sm border-b border-gray-500"}>
                        <div className={"flex-1"}>{props.title}</div>
                        <MdClose className={"cursor-pointer hover:opacity-70 active:opacity-50"}
                                 onClick={() => props.setShowed(false)}/>
                    </div>
                    {props.children}
                </div>
            </div>
        }
    </>;
}