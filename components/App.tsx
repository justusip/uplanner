import React, {useEffect} from "react";
import moment from "moment";
import CourseSelection from "../types/CourseSelection";
import SelectionPanel from "../components/SelectionPanel";
import Timetable from "../components/Timetable";
import Course from "../types/Course";
import {FormControl, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {MdOutlineCalendarToday} from "react-icons/md";
import Lesson from "../types/Lesson";
import ExportButton from "./ExportButton";

export default function App(props: {
    catalog: Course[]
}) {
    const [term, setTerm] = React.useState("Sem 1");
    const [selections, setSelections] = React.useState<CourseSelection[]>([]);
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

    useEffect(() => {
        if (localStorage.getItem("sel"))
            setSelections(JSON.parse(localStorage.getItem("sel")!) as CourseSelection[]);
    }, []);
    useEffect(() => {
        localStorage.setItem("sel", JSON.stringify(selections));
    }, [selections]);

    return <div className={"w-screen h-screen bg-gray-800 flex flex-col text-white"}>
        <div className={"px-4 py-2 border-b border-gray-500 flex gap-4 place-items-center"}>
            <MdOutlineCalendarToday className={"text-2xl"}/>
            <FormControl size={"small"}>
                <InputLabel>學府</InputLabel>
                <Select value={0}>
                    <MenuItem value={0}>香港大學</MenuItem>
                </Select>
            </FormControl>
            <FormControl size={"small"} disabled>
                <InputLabel>學年</InputLabel>
                <Select value={0}>
                    <MenuItem value={0}>2022-2023</MenuItem>
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
                            value: "Sem 1"
                        },
                        {
                            name: "冬/WS",
                            value: "Win Sem",
                            disabled: true
                        },
                        {
                            name: "春/S2",
                            value: "Sem 2"
                        },
                        {
                            name: "夏/SS",
                            value: "Sum Sem"
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
