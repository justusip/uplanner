import {BsSearch} from "react-icons/bs";
import React, {useMemo, useState} from "react";
import cx from "classnames";
import Course from "../types/Course";
import CourseSelection from "../types/CourseSelection";
import {InputBase} from "@mui/material";
import {MdCheckCircle} from "react-icons/md";
import TranslateSem from "../utils/TranslateSem";
import Popup from "./Popup";

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

    return <Popup showed={props.showed}
                  setShowed={props.setShowed}
                  title={`新增${TranslateSem(props.term)}嘅課程`}
                  fixed>
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
                                       "w-full flex flex-col p-2 cursor-pointer hover:bg-white/10 active:bg-black/10 text-left",
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
                        <div className={"flex place-items-center"}>
                            {course.code}
                            <span className={cx(
                                "bg-gray-600 text-xs px-[4px] py-[2px] rounded mx-1",
                            )}>{TranslateSem(course.term)}</span>
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
        <div className={"flex place-items-center gap-2 border-t border-gray-500 p-2 text-white/50 text-sm"}>
            <MdCheckCircle/>課程資料已經更新至29/7/2023。
        </div>
    </Popup>;
}
