import React from "react";
import classNames from "classnames";

export default function IntrinsicButton(props: React.PropsWithChildren<{} & React.HTMLProps<HTMLButtonElement>>) {
    return <button
        {...props as any}
        className={classNames(
            "bg-neutral-50 px-2 py-1 text-sm flex place-items-center",
            "hover:bg-white",
            props.className
        )}>
        {props.children}
    </button>;
}
