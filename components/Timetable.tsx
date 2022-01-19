import React from "react";
import moment from "moment";
import CourseSelection from "./CourseSelection";
import Course from "./Course";

export default function Timetable(props: {
    beginDay: moment.Moment,
    events: {
        code: string,
        name: string,
        section: string,
        venue: string,
        from: moment.Moment,
        to: moment.Moment
    }[],
    selections: CourseSelection[]
}) {
    const lastDay = React.useMemo(() => props.beginDay.clone().add(7, "days"), [props.beginDay]);

    const scopedEvents = React.useMemo(() =>
            props.events.filter(e => e.from.isBetween(props.beginDay, lastDay, undefined, "[]")),
        [props.beginDay, lastDay, props.events]);

    const scopeFromHour = 7;
    const scopeToHour = 22;
    const scopeTotalHour = scopeToHour - scopeFromHour;
    const firstWeekday = 1; // Monday
    const weekdaysShown = 6;

    return <div className={"grow h-full flex flex-col"}>
        <div className={"pl-[70px] flex"}>
            {
                "一二三四五六".split("").map((name, i) =>
                    <div className={"timetable-days-item"} key={i}>
                        {name}
                    </div>
                )
            }
        </div>
        <div className={"flex grow"}>
            <div className={"w-[70px] relative"}>
                {
                    [...Array(scopeToHour - scopeFromHour)].map((_, i) => {
                        const hour = scopeFromHour + i;
                        return <div className={"w-full pr-[14px] absolute text-[12px] flex align-middle justify-end text-neutral-400"}
                                    style={{top: `calc(${100 * (hour - scopeFromHour) / scopeTotalHour}% - 10px)`}}
                                    key={i}>
                            {hour == 12 ? "noon" : hour <= 12 ? `${hour} am` : `${hour - 12} pm`}
                        </div>;
                    })
                }
            </div>
            <div className={"grow relative"}>
                {
                    [...Array(scopeToHour - scopeFromHour)].map((_, i) => {
                        const hour = scopeFromHour + i;
                        return <>
                            <div className={"absolute left-[-8px] w-[calc(100%+8px)] h-[1px] bg-neutral-300"}
                                 key={-i * 3}
                                 style={{
                                     top: `${100 * (hour - scopeFromHour) / scopeTotalHour}%`
                                 }}/>
                            <div className={"absolute left-[-8px] w-[calc(100%+8px)] h-[1px] bg-neutral-300 opacity-50"}
                                 key={-i * 3 - 1}
                                 style={{
                                     top: `${100 * (hour - scopeFromHour + .5) / scopeTotalHour}%`
                                 }}/>
                        </>;
                    })
                }
                {
                    [...Array(7)].map((_, i) =>
                        <div className={"absolute top-[-16px] w-[1px] h-[calc(100%+16px)] bg-neutral-300"}
                             key={-i * 3 - 2}
                             style={{
                                 left: `${100 * (i + 1) / 6}%`
                             }}/>)
                }
                {
                    scopedEvents.map((e, i) => {
                        const eventFrom = (e.from.hour() * 60 * 60 + e.from.minute() * 60 + e.from.second());
                        const eventTo = (e.to.hour() * 60 * 60 + e.to.minute() * 60 + e.to.second());
                        const scaledFrom = (eventFrom - (scopeFromHour * 60 * 60)) / (scopeTotalHour * 60 * 60);
                        const scaledTo = (eventTo - (scopeFromHour * 60 * 60)) / (scopeTotalHour * 60 * 60);

                        const dayOfWeek = e.from.day();
                        return <div
                            className={"absolute bg-blue-500 bg-opacity-20 border-l-2 border-blue-500 p-1 pl-2 text-blue-500 overflow-hidden"}
                            key={i}
                            style={{
                                top: `${scaledFrom * 100}%`,
                                left: `${((dayOfWeek - firstWeekday) / weekdaysShown) * 100}%`,
                                width: `${100 / weekdaysShown}%`,
                                height: `${(scaledTo - scaledFrom) * 100}%`,
                            }}>
                            <div className={"text-sm font-bold"}>{e.code}</div>
                            <div className={"text-xs"}>{e.name}</div>
                            <div className={"text-xs font-bold"}>{e.venue}</div>
                        </div>;
                    })
                }
            </div>
        </div>
    </div>;
}
