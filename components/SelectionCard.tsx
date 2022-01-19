import {Draggable} from "react-beautiful-dnd";
import {BsXLg} from "react-icons/bs";
import React from "react";
import Course from "./Course";
import cx from "classnames";

export default function SelectionPanel(props: {
    course: Course,
    index: number,
    sectionName: string,
    setSection: (sectionName: string | null) => void,
}) {
    return <Draggable key={props.course.code} draggableId={props.course.code} index={props.index}>
        {(provided, snapshot) => (
            <div className={cx(
                "bg-white p-4 space-y-1 border border-b-neutral-300",
                {"border-transparent": !snapshot.isDragging},
                {"border-neutral-300": snapshot.isDragging}
            )}
                 ref={provided.innerRef}
                 {...provided.draggableProps}
                 {...provided.dragHandleProps}
                 style={provided.draggableProps.style}>
                <div>
                    <div className={"flex items-center"}>
                        <div className={"text-sm font-bold grow"}>{props.course.code}</div>
                        <BsXLg className={"text-xs cursor-pointer text-gray-500 hover:text-gray-800"}
                               onClick={() => props.setSection(null)}/>
                    </div>
                    <div className={"text-sm text-gray-800"}>{props.course.title}</div>
                </div>
                <div className={"flex flex-wrap place-content-between gap-1"}>
                    {
                        props.course.sections.map((section, i) =>
                            <button key={i}
                                    className={cx(
                                        "text-xs p-1 border grow",
                                        {"hover:bg-neutral-200": props.sectionName !== section.sectionName},
                                        {"bg-black text-white cursor-not-allowed": props.sectionName === section.sectionName},
                                    )}
                                    onClick={() => props.setSection(section.sectionName)}
                            >{section.sectionName}</button>)
                    }
                </div>
            </div>
        )}
    </Draggable>;
}
