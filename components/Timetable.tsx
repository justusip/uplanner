import React from "react";
import CourseSelection from "../types/CourseSelection";
import RecurringLesson from "../types/RecurringLesson";
import Lesson from "../types/Lesson";
import Interval from "../types/Interval";
import cx from "classnames";

export default function Timetable(props: {
    term: string,
    lessons: Lesson[]
    selections: CourseSelection[],
}) {
    const scopedLessons = React.useMemo(() => props.lessons.filter(o => o.term === props.term), [props.lessons, props.term]);
    const recurringLessons = React.useMemo(() => {
            const recurringLessons: RecurringLesson[] = [];
            nextLesson: for (const lesson of scopedLessons) {
                for (const o of recurringLessons) {
                    if (lesson.code === o.code && lesson.subclass === o.subclass &&
                        o.from.sameAs(lesson.from) && o.to.sameAs(lesson.to)) {
                        if (!o.venue.includes(lesson.venue))
                            o.venue.push(lesson.venue);
                        continue nextLesson;
                    }
                }

                recurringLessons.push({
                    code: lesson.code,
                    term: lesson.term,
                    subclass: lesson.subclass,
                    title: lesson.title,
                    venue: [lesson.venue],
                    from: new Interval(lesson.from),
                    to: new Interval(lesson.to),
                    isConflict: false,
                    isPreview: lesson.isPreview
                });
            }

            for (const a of recurringLessons) {
                for (const b of recurringLessons) {
                    if (a === b)
                        continue;
                    if (a.isPreview || b.isPreview)
                        continue;
                    if (b.to.eOrLThan(a.from) && a.to.eOrLThan(b.from)) {
                        a.isConflict = true;
                        b.isConflict = true;
                    }
                }
            }
            return recurringLessons;
        },
        [scopedLessons]);

    const scopeFromHour = 7;
    const scopeToHour = 22;
    const scopeTotalHour = scopeToHour - scopeFromHour;
    const firstWeekday = 1; // Monday
    const weekdaysShown = 6;

    return <div className={"grow h-full flex flex-col"}>
        <div className={"pl-[70px] flex"}>
            {
                ["一", "二", "三", "四", "五", "六"].map((name, i) =>
                    <div key={i}
                         className={"w-[calc(100%/6)] h-[60px] flex place-items-center place-content-center text-neutral-400"}>
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
                        return <div key={i}
                                    className={"w-full pr-[14px] absolute text-[12px] flex align-middle justify-end text-neutral-400"}
                                    style={{top: `calc(${100 * (hour - scopeFromHour) / scopeTotalHour}% - 10px)`}}>
                            {hour == 12 ? "noon" : hour <= 12 ? `${hour} am` : `${hour - 12} pm`}
                        </div>;
                    })
                }
            </div>
            <div className={"grow relative"}>
                {
                    [...Array(scopeToHour - scopeFromHour)].map((_, i) => {
                        const hour = scopeFromHour + i;
                        return [
                            <div key={-i * 3}
                                 className={"absolute left-[-8px] w-[calc(100%+8px)] h-[1px] bg-gray-500"}
                                 style={{
                                     top: `${100 * (hour - scopeFromHour) / scopeTotalHour}%`
                                 }}/>,
                            <div className={"absolute left-[-8px] w-[calc(100%+8px)] h-[1px] bg-gray-500 opacity-30"}
                                 key={-i * 3 - 1}
                                 style={{
                                     top: `${100 * (hour - scopeFromHour + .5) / scopeTotalHour}%`
                                 }}/>
                        ];
                    })
                }
                {
                    [...Array(6)].map((_, i) =>
                        <div key={-i * 3 - 2}
                             className={"absolute top-[-16px] w-[1px] h-[calc(100%+16px)] bg-gray-500"}
                             style={{
                                 left: `${100 * (i) / 6}%`
                             }}/>)
                }
                {
                    recurringLessons.map((e, i) => {
                        const eventFrom = (e.from.hour * 60 * 60 + e.from.minute * 60);
                        const eventTo = (e.to.hour * 60 * 60 + e.to.minute * 60);
                        const scaledFrom = (eventFrom - (scopeFromHour * 60 * 60)) / (scopeTotalHour * 60 * 60);
                        const scaledTo = (eventTo - (scopeFromHour * 60 * 60)) / (scopeTotalHour * 60 * 60);

                        const dayOfWeek = e.from.weekDay;
                        return <div key={i}
                                    className={cx("absolute bg-opacity-20 border-l-2 p-1 pl-2 overflow-hidden",
                                        {"bg-sky-500 border-sky-500 text-sky-500": !e.isPreview && !e.isConflict},
                                        {"bg-amber-500 border-amber-500 text-amber-500": !e.isPreview && e.isConflict},
                                        {"bg-neutral-500 border-neutral-500 text-neutral-500": e.isPreview}
                                    )}
                                    style={{
                                        top: `${scaledFrom * 100}%`,
                                        left: `${((dayOfWeek - firstWeekday) / weekdaysShown) * 100}%`,
                                        width: `${100 / weekdaysShown}%`,
                                        height: `${(scaledTo - scaledFrom) * 100}%`,
                                    }}>
                            <div className={"flex gap-x-1 gap-y-0.5 place-items-center flex-wrap"}>
                                <div className={"text-sm font-bold"}>{e.code}</div>
                                <div className={"text-xs font-bold"}>{e.venue.join(",")}</div>
                            </div>
                            <div className={"text-xs"}>{e.title}</div>
                        </div>;
                    })
                }
            </div>
        </div>
    </div>;
}
