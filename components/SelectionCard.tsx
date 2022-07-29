import {Draggable} from "react-beautiful-dnd";
import React from "react";
import Course from "../types/Course";
import cx from "classnames";
import {MdClose} from "react-icons/md";

export default function SelectionPanel(props: {
    course: Course,
    index: number,
    curSubclass: string,
    onSelect: (subclass: string | null) => void,
    onPreview: (subclass: string | null) => void
}) {
    return <Draggable key={props.course.code} draggableId={props.course.code} index={props.index}>
        {(provided, snapshot) => (
            <div className={cx(
                "bg-gray-700 p-2 flex flex-col gap-2 border border-b-gray-500",
                {"border-transparent": !snapshot.isDragging},
                {"border-gray-500": snapshot.isDragging}
            )}
                 ref={provided.innerRef}
                 {...provided.draggableProps}
                 {...provided.dragHandleProps}
                 style={provided.draggableProps.style}>
                <div>
                    <div className={"flex items-center"}>
                        <div className={"text-sm font-bold grow"}>{props.course.code}</div>
                        <MdClose className={"cursor-pointer hover:opacity -70"}
                                 onClick={() => props.onSelect(null)}/>
                    </div>
                    <div className={"text-sm"}>{props.course.title}</div>
                </div>
                <div className={"flex flex-wrap gap-1"}>
                    {
                        props.course.subclass.map((section, i) =>
                            <button key={i}
                                    className={cx(
                                        "w-8 h-8 p-1 rounded-[50%] text-xs",
                                        {"hover:bg-white/20 active:bg-black/50": props.curSubclass !== section.name},
                                        {"bg-black/30 text-white cursor-default": props.curSubclass === section.name},
                                    )}
                                    onMouseOver={() => props.onPreview(section.name)}
                                    onMouseOut={() => props.onPreview(null)}
                                    onClick={() => props.onSelect(section.name)}
                            >{section.name}</button>)
                    }
                </div>
            </div>
        )}
    </Draggable>;
}
