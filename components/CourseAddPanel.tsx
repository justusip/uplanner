import {BsSearch} from "react-icons/bs";
import React, {useMemo, useState} from "react";
import cx from "classnames";
import Course from "../types/Course";
import CourseSelection from "../types/CourseSelection";
import EventListener from "react-event-listener";
import {InputBase} from "@mui/material";
import {MdCheckCircle} from "react-icons/md";

export default function CourseAddPanel(props: {
    term: string,
    showed: boolean,
    setShowed: (showed: boolean) => void,
    courseCatalog: Course[]
    selections: CourseSelection[],
    addSelection: (sel: CourseSelection) => void
}) {
    const scopedCatalog = useMemo(() => props.courseCatalog.filter(o => o.term === props.term), [props.courseCatalog, props.term]);

    const [query, setQuery] = useState("");
    const prettyQuery = useMemo(() => query.trim().toLowerCase(), [query]);
    const results = useMemo(() => {
        if (prettyQuery.length < 3)
            return [];
        const directResults = scopedCatalog.filter(o => o.code.toLowerCase().includes(prettyQuery));
        const oo = scopedCatalog.filter(o => o.title.toLowerCase().includes(prettyQuery));
        const combined = new Set([...directResults, ...oo]);
        return Array.from(combined);
    }, [prettyQuery, scopedCatalog]);

    return <div className={"absolute inset-0 z-10 bg-black/50 flex place-items-center place-content-center"}
                onClick={() => props.setShowed(false)}>
        <EventListener target={"document"}
                       onKeyDown={(e: KeyboardEvent) => {
                           if (e.key == "Escape")
                               props.setShowed(false);
                       }}/>
        <div className={"w-[600px] h-[400px] max-w-full max-h-full overflow-hidden bg-gray-800 flex flex-col border border-gray-500"}
             onClick={e => e.stopPropagation()}>
            <div className={"p-2 flex gap-2 text-sm border-b border-gray-500"}>
                新增{props.term}課程
            </div>
            <div className={"p-2 flex place-items-center gap-4 border-b border-gray-500"}>
                <BsSearch/>
                <InputBase value={query}
                           onChange={e => setQuery(e.target.value)}
                           placeholder={"搜尋課程編號、名稱..."}
                           autoFocus
                           fullWidth/>
            </div>
            <div className={"h-0 grow overflow-y-scroll relative"}>
                {
                    results.length === 0 &&
                    <div
                        className={"w-full h-full flex flex-col place-items-center place-content-center gap-2 opacity-40"}>
                        <img src={"moai_1f5ff.png"} width={100} alt={"moai"}/>
                        {
                            prettyQuery.length < 3 ?
                                <div>請輸入至少三隻字</div> :
                                <div>揾唔到有關「{prettyQuery}」嘅課程</div>

                        }
                    </div>
                }
                {
                    results.length > 0 && results.map((course, i) => {
                        const selected = props.selections.find(s => s.code === course.code && s.term === course.term);
                        const thisSem = course.term === props.term;
                        const disabled = !(thisSem && !selected);
                        return <button key={i}
                                       className={cx(
                                           "w-full flex flex-col p-2 cursor-pointer hover:bg-white/10 active:bg-black/10",
                                           {"opacity-30 hover:bg-inherit cursor-not-allowed": disabled}
                                       )}
                                       onClick={() => {
                                           if (disabled)
                                               return;
                                           props.addSelection({
                                               code: course.code,
                                               term: course.term,
                                               subclass: course.subclass[0].name
                                           });
                                           setQuery("");
                                           props.setShowed(false);
                                       }}>
                            <div className={"course-code flex place-items-center"}>
                                {course.code}
                                <span className={cx(
                                    "bg-gray-600 text-xs px-[4px] py-[2px] rounded mx-1",
                                )}>{course.term}</span>
                                {
                                    selected &&
                                    <span
                                        className={"bg-lime-600 text-xs text-white px-[4px] py-[2px] rounded mx-1 flex gap-1 place-items-center"}><MdCheckCircle/>已經加入</span>
                                }
                            </div>
                            <div className={"text-sm"}>{course.title}</div>
                        </button>;
                    })
                }
            </div>
        </div>
    </div>;
}
