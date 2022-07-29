import React, {useEffect, useMemo, useRef} from "react";
import moment from "moment";
import CourseSelection from "../types/CourseSelection";
import SelectionPanel from "../components/SelectionPanel";
import Timetable from "../components/Timetable";
import Course from "../types/Course";
import {FormControl, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {MdOutlineCalendarToday} from "react-icons/md";
import Lesson from "../types/Lesson";
import ExportButton from "./ExportButton";
import Metadata from "../types/Metadata";
import {Settings} from "../types/Settings";
import useLocalStorage from "./useLocalStorage";

export default function App(props: {
    metadata: Metadata,
    settings: Settings,
    setSettings: (settings: Settings) => void,
    catalog: Course[]
}) {
    const institutions = useMemo(() => {
        return props.metadata.institutions.map(o => o.name);
    }, [props.metadata]);
    const years = useMemo(() => {
        return props.metadata.institutions.find(o => o.name === props.settings.institution)!.years.map(o => o.year);
    }, [props.settings, props.metadata.institutions]);

    const [term, setTerm] = React.useState("s1");
    const [selections, setSelections] = useLocalStorage<CourseSelection[]>("82041b4d-56b5-4916-b812-6594a8b41786", []);
    const prevSettings = useRef<Settings | null>();
    useEffect(() => {
        const prev = prevSettings.current;
        const cur = props.settings;
        if (prev && cur && (prev.year !== cur.year || prev.institution !== cur.institution))
            setSelections([]);
        prevSettings.current = props.settings;
    }, [props.settings]);
    const [preview, setPreview] = React.useState<CourseSelection | null>(null);

    const lessons = React.useMemo<Lesson[]>(() => {
        return [...selections, preview]
            .filter(o => !!o)
            .flatMap(entry => {
                const course = props.catalog.find(o => entry!.code == o.code && entry!.term == o.term)!;
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

    return <div className={"w-full h-full flex flex-col"}>
        <div className={"px-4 py-2 border-b border-gray-500 flex gap-4 place-items-center"}>
            <MdOutlineCalendarToday className={"text-2xl"}/>
            <FormControl size={"small"}>
                <InputLabel>學院</InputLabel>
                <Select value={props.settings.institution}
                        onChange={e => props.setSettings({...props.settings, institution: e.target.value})}>
                    {institutions.map((o, i) => <MenuItem key={i} value={o}>{o}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl size={"small"}>
                <InputLabel>學年</InputLabel>
                <Select value={props.settings.year}
                        onChange={e => props.setSettings({...props.settings, year: e.target.value})}>
                    {years.map((o, i) => <MenuItem key={i} value={o}>{o}</MenuItem>)}
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
                            name: "秋/S1",
                            value: "s1"
                        },
                        {
                            name: "冬/WS",
                            value: "ws",
                            disabled: true
                        },
                        {
                            name: "春/S2",
                            value: "s2"
                        },
                        {
                            name: "夏/SS",
                            value: "ss"
                        },
                    ].map((o, i) => <ToggleButton key={i} value={o.value}
                                                  disabled={o.disabled}>{o.name}</ToggleButton>)
                }
            </ToggleButtonGroup>
            <ExportButton lessons={lessons}/>
        </div>
        <div className={"flex grow"}>
            <Timetable lessons={lessons} selections={selections} term={term}/>
            <SelectionPanel term={term}
                            catalog={props.catalog!}
                            entries={selections}
                            setEntries={setSelections}
                            setPreview={setPreview}/>
        </div>
    </div>;
}
