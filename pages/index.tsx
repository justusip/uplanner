import type {NextPage} from "next";
import React, {useEffect} from "react";
import {
    BsArrowLeft,
    BsArrowRight,
    BsFillCaretDownFill,
    BsFillCaretLeftFill,
    BsFillCaretRightFill
} from "react-icons/bs";
import moment from "moment";
import CourseSelection from "../types/CourseSelection";
import SelectionPanel from "../components/SelectionPanel";
import Timetable from "../components/Timetable";
import Course from "../types/Course";
import ical from "ical-generator";
import IntrinsicButton from "../components/IntrinsicButton";

const DateButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onPrevClicked: () => void,
    onNextClicked: () => void,
}) =>
    <div className={"flex text-sm bg-white border rounded"}>
        <IntrinsicButton className={"px-2 py-1"} onClick={props.onPrevClicked}><BsArrowLeft/></IntrinsicButton>
        <IntrinsicButton {...props} className={"border-x px-2 py-1"}>{props.children}</IntrinsicButton>
        <IntrinsicButton className={"px-2 py-1"} onClick={props.onNextClicked}><BsArrowRight/></IntrinsicButton>
    </div>;

const Home: NextPage = () => {
    const [courseCatalog, setCourseCatalog] = React.useState<Course[] | null>(null);

    const [beginDay, setBeginDay] = React.useState(moment("20220117", "YYYYMMDD"));
    const [courseSel, setCourseSel] = React.useState<CourseSelection[]>([]);

    const events = React.useMemo<{
        code: string,
        name: string,
        section: string,
        venue: string,
        from: moment.Moment,
        to: moment.Moment
    }[] | null>(() => {
        if (!courseCatalog)
            return null;
        return courseSel.flatMap(selection => {
            const course = courseCatalog!.find(c => selection.code == c.code && selection.term == c.term)!;
            const section = course.sections.find(s => selection.sectionName === s.sectionName)!;
            return course.sections.find(o => selection.sectionName === o.sectionName)!.times.map(interval => {
                return {
                    code: course.code,
                    name: course.title,
                    section: section.sectionName,
                    venue: interval.venue,
                    from: moment(interval.from),
                    to: moment(interval.to)
                };
            });
        });
    }, [courseCatalog, courseSel]);
    const saveFile = (filename: string, data: string) => {
        const blob = new Blob([data], {type: "text/plain"});
        const elem = window.document.createElement("a");
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    };
    const downloadICS = () => {
        if (!events)
            return;
        const calendar = ical({
            name: "Course Timetable",
            prodId: {
                company: "Moougi",
                product: "Course Planner",
                language: "EN"
            }
        });
        for (const e of events) {
            calendar.createEvent({
                summary: `${e.code} - ${e.venue}`,
                description: e.name,
                start: e.from,
                end: e.to,
            });
        }
        saveFile(`generated-timetable-${moment().format("YYYYMMDD-HHmmss")}.ics`, calendar.toString());
    };

    const refresh = async () => {
        const res = await fetch("out.json");
        const resJson = await res.json();
        setCourseCatalog(resJson);
    };

    useEffect(() => {
        if (localStorage.getItem("sel"))
            setCourseSel(JSON.parse(localStorage.getItem("sel")!) as CourseSelection[]);
        refresh().then();
    }, []);
    useEffect(() => {
        localStorage.setItem("sel", JSON.stringify(courseSel));
    }, [courseSel]);

    if (!courseCatalog)
        return <div/>;

    return <div className={"h-screen flex flex-col"}>
        <div className={"p-2 border flex gap-2  bg-gray-100 place-items-center"}>
            {/*<div className={"text-sm"}>Timetable Planner</div>*/}
            <IntrinsicButton className={"ml-1 flex place-items-center place-content-between w-[150px]"}>
                2021-2022 Sem 2
                <BsFillCaretDownFill className={"text-xs"}/>
            </IntrinsicButton>
            <DateButton onPrevClicked={() => setBeginDay(beginDay.clone().add(-7, "days"))}
                        onNextClicked={() => setBeginDay(beginDay.clone().add(7, "days"))}>
                {beginDay.format("DD MMM YYYY")} ~ {beginDay.clone().add(6, "days").format("DD MMM YYYY")}
            </DateButton>
            <IntrinsicButton className={"ml-1"}
                             onClick={() => downloadICS()}>
                Export
            </IntrinsicButton>
        </div>
        <div className={"flex grow"}>
            <Timetable beginDay={beginDay}
                       events={events!}
                       selections={courseSel}/>
            <SelectionPanel courseCatalog={courseCatalog!}
                            setSelections={setCourseSel}
                            selections={courseSel}/>
        </div>
    </div>;
};

export default Home;
