import Lesson from "../types/Lesson";
import ical from "ical-generator";
import moment from "moment/moment";
import {MdDownload} from "react-icons/md";
import {Button} from "@mui/material";
import React from "react";

export default function ExportButton(props: {
    lessons: Lesson[]
}) {
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
        const calendar = ical({
            name: "Course Timetable",
            prodId: {
                company: "Moougi",
                product: "Course Planner",
                language: "EN"
            }
        });
        for (const lesson of props.lessons) {
            calendar.createEvent({
                summary: `${lesson.code} - ${lesson.venue}`,
                description: lesson.title,
                start: lesson.from,
                end: lesson.to,
            });
        }
        saveFile(`generated-timetable-${moment().format("YYYYMMDD-HHmmss")}.ics`, calendar.toString());
    };

    return <Button variant="outlined" onClick={() => downloadICS()} startIcon={<MdDownload/>}>下載ics檔</Button>;
}
