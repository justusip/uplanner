import {BsSearch} from "react-icons/bs";
import React, {useEffect, useMemo, useState} from "react";
import cx from "classnames";
import Course from "../types/Course";
import CourseSelection from "../types/CourseSelection";
import Fuse from "fuse.js";
import EventListener from "react-event-listener";

export default function CourseAddPanel(props: {
    showed: boolean,
    setShowed: (showed: boolean) => void,
    courseCatalog: Course[]
    selections: CourseSelection[],
    addSelection: (sel: CourseSelection) => void
}) {
    const [query, setQuery] = useState("");
    const curSem = "2021-22 Sem 2";

    // const options = {
    //     keys: ["code", "title"]
    // };
    // const fuseIndex = useMemo(
    //     () => Fuse.createIndex(options.keys, props.courseCatalog),
    //     [options.keys, props.courseCatalog]
    // );
    // const fuse = useMemo(() => new Fuse(props.courseCatalog, options, fuseIndex), [fuseIndex, options, props.courseCatalog]);
    // const results = useMemo(() => fuse.search(query).map(o => o.item), [fuse, query]);
    const results = useMemo(() => props.courseCatalog.filter(o => o.code.toLowerCase().startsWith(query.toLowerCase())), [query]);

    return <div className={"absolute z-10 inset-0 bg-black/25 flex place-items-center place-content-center"}
                onClick={() => props.setShowed(false)}>
        <EventListener target={"document"}
                       onKeyDown={(e: KeyboardEvent) => {
                           if (e.key == "Escape")
                               props.setShowed(false);
                       }}/>
        <div className={"w-[600px] h-[400px] rounded overflow-hidden bg-white flex flex-col"}
             onClick={e => e.stopPropagation()}>
            <div className={"p-4 flex place-items-center border"}>
                <BsSearch color={"#555"}/>
                <input className={"selection-searchbox-input"}
                       value={query}
                       onChange={e => setQuery(e.target.value)}
                       placeholder={"Search a course..."}
                       autoFocus/>
            </div>
            <div className={"h-0 grow overflow-y-scroll relative bg-white bg-opacity-20"}>
                {/*{*/}
                {/*    !results && <div className={"p-4"}>N/A</div>*/}
                {/*}*/}
                {
                    query !== "" && results.map((course, i) => {
                        const disabled = props.selections.find(s => s.code === course.code && s.term === course.term) || course.term != curSem;
                        return <button key={i}
                                    className={cx(
                                        "w-full flex flex-col p-2 border border-b-neutral-300 cursor-pointer hover:bg-neutral-200",
                                        {"text-neutral-500 hover:bg-inherit cursor-not-allowed": disabled}
                                    )}
                                    onClick={() => {
                                        if (disabled)
                                            return;
                                        props.addSelection({
                                            code: course.code,
                                            term: course.term,
                                            sectionName: course.sections[0].sectionName
                                        });
                                        setQuery("");
                                    }}>
                            <div className={"course-code flex place-items-center"}>
                                {course.code}
                                <span className={"bg-gray-100 text-xs px-[4px] py-[2px] rounded mx-1"}>{course.term}</span>
                            </div>
                            <div className={"text-sm"}>{course.title}</div>
                        </button>;
                    })
                }
            </div>
        </div>
    </div>;
}
