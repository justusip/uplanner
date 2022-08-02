import React, {useEffect, useMemo, useRef, useState} from "react";
import moment from "moment";
import CourseSelection from "../types/CourseSelection";
import SelectionPanel from "../components/SelectionPanel";
import Timetable from "../components/Timetable";
import Course from "../types/Course";
import {FormControl, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {MdCheckCircle, MdClose, MdOutlineCalendarToday, MdWarning} from "react-icons/md";
import Lesson from "../types/Lesson";
import ExportButton from "./ExportButton";
import Metadata from "../types/Metadata";
import {Settings} from "../types/Settings";
import useLocalStorage from "./useLocalStorage";
import TranslateSem from "../utils/TranslateSem";

export default function App(props: {
    metadata: Metadata | null,
    settings: Settings | null,
    setSettings: (settings: Settings) => void,
    catalog: Course[] | null
}) {
    const institutions = useMemo(() => {
        if (!props.metadata) return [];
        return props.metadata.institutions.map(o => o.name);
    }, [props.metadata]);
    const years = useMemo(() => {
        if (!props.metadata || !props.settings) return [];
        return props.metadata.institutions.find(o => o.name === props.settings!.institution)!.years.map(o => o.year);
    }, [props.settings, props.metadata]);

    const [term, setTerm] = React.useState("s1");

    const [selections, setSelections] = useState<CourseSelection[]>([]);
    const selStorageKey = "82041b4d-56b5-4916-b812-6594a8b41786";
    useEffect(() => {
        try {
            if (!props.catalog) return;
            const content = localStorage.getItem(selStorageKey);
            if (!content) return;
            const prevSelections = JSON.parse(content) as CourseSelection[];
            let validSelections: CourseSelection[] = [];
            let invalidSelections: CourseSelection[] = [];
            for (const sel of prevSelections) {
                const c = props.catalog!.find(o => o.code === sel.code && o.term === sel.term)?.subclass.find(s => s.name === sel.subclass);
                if (!c) {
                    invalidSelections.push(sel);
                    continue;
                }
                validSelections.push(sel);
            }
            if (invalidSelections.length > 0) {
                alert(`課程資料有所變動。\n喺你舊嘅選擇之中，有${invalidSelections.length}個課程已經被移除。\n\n已經移除嘅課程：\n${invalidSelections.map((o, i) => `${i + 1}. ${o.code} ${o.subclass}`).join("\n")}\n\n請重新選擇。`);
            }
            setAndSaveSelections(validSelections);
        } catch (ex) {
            setAndSaveSelections([]);
            console.error(ex);
        }
    }, [props.catalog]);
    const setAndSaveSelections = (selections: CourseSelection[]) => {
        localStorage.setItem(selStorageKey, JSON.stringify(selections));
        setSelections(selections);
    };

    const prevSettings = useRef<Settings | null>();
    useEffect(() => {
        const prev = prevSettings.current;
        const cur = props.settings;
        if (prev && cur && (prev.year !== cur.year || prev.institution !== cur.institution))
            setAndSaveSelections([]);
        prevSettings.current = props.settings;
    }, [props.settings]);
    const [preview, setPreview] = React.useState<CourseSelection | null>(null);

    const lessons = React.useMemo<Lesson[]>(() => {
        if (!props.catalog)
            return [];
        return [...selections, preview]
            .filter(o => !!o)
            .flatMap(entry => {
                const course = props.catalog!.find(o => entry!.code === o.code && entry!.term === o.term)!;
                const subclass = course.subclass.find(o => entry!.subclass === o.name)!;
                return subclass.times.map(lesson => ({
                    ...entry,
                    title: course.title,
                    venue: lesson.venue,
                    from: moment(lesson.from),
                    to: moment(lesson.to),
                    isPreview: entry === preview
                }) as Lesson);
            });
    }, [preview, props.catalog, selections]);

    const [warnShowed, setWarnShowed] = useState(true);

    return <div className={"w-full h-full flex flex-col"}>
        <div className={"px-4 py-2 border-b border-gray-500 flex gap-4 place-items-center"}>
            <MdOutlineCalendarToday className={"text-2xl"}/>
            <FormControl size={"small"}>
                <InputLabel shrink>大學</InputLabel>
                <Select value={"香港大學"}
                        onChange={e => props.setSettings({...props.settings!, institution: e.target.value})}>
                    {/*{institutions.map((o, i) => <MenuItem key={i} value={o}>{o}</MenuItem>)}*/}
                    <MenuItem value={"香港大學"}>{"香港大學"}</MenuItem>
                </Select>
            </FormControl>
            <FormControl size={"small"}>
                <InputLabel shrink>學年</InputLabel>
                <Select notched value={"2022-2023"}
                        onChange={e => props.setSettings({...props.settings!, year: e.target.value})}>
                    {/*{years.map((o, i) => <MenuItem key={i} value={o}>{o}</MenuItem>)}*/}
                    <MenuItem value={"2022-2023"}>{"2022-2023"}</MenuItem>
                </Select>
            </FormControl>
            <ToggleButtonGroup color="primary"
                               exclusive
                               size={"small"}
                               value={term}
                               onChange={(_, v) => {
                                   if (v)
                                       setTerm(v);
                               }}>
                {
                    [
                        {
                            name: "SEM 1",
                            value: "s1"
                        },
                        // {
                        //     name: "WIN SEM",
                        //     value: "ws",
                        //     disabled: true
                        // },
                        {
                            name: "SEM 2",
                            value: "s2"
                        },
                        {
                            name: "Sum Sem",
                            value: "ss"
                        },
                    ].map((o, i) => <ToggleButton key={i} value={o.value}
                                                  disabled={false}>{o.name}</ToggleButton>)
                }
            </ToggleButtonGroup>
            <ExportButton lessons={lessons}/>
        </div>
        {
            warnShowed &&
            <div className={"flex place-items-center gap-2 border-b border-gray-500 p-2 text-sm place-content-center"}>
                <MdWarning/>課程資料只供參考。最新資料請瀏覽HKUPortal。
                <MdClose className={"cursor-pointer hover:opacity-70 active:opacity-50 ml-auto"}
                         onClick={() => setWarnShowed(false)}/>
            </div>
        }
        <div className={"flex grow"}>
            <Timetable lessons={lessons} selections={selections} term={term}/>
            <SelectionPanel term={term}
                            catalog={props.catalog!}
                            entries={selections}
                            setEntries={setAndSaveSelections}
                            setPreview={setPreview}/>
        </div>
    </div>;
}
