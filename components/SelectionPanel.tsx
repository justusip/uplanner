import React from "react";
import Course from "../types/Course";
import CourseSelection from "../types/CourseSelection";
import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import SelectionCard from "./SelectionCard";
import CourseAddPanel from "./CourseAddPanel";
import {Button} from "@mui/material";
import {MdAddCircle} from "react-icons/md";

export default function SelectionPanel(props: {
    term: string,
    catalog: Course[],
    entries: CourseSelection[],
    setEntries: (selections: CourseSelection[]) => void,
    setPreview: (subclass: CourseSelection | null) => void
}) {

    const scopedEntries = React.useMemo(() => props.entries.filter(s => s.term === props.term), [props.entries, props.term]);
    const [panelShowed, setPanelShowed] = React.useState(false);

    const reorder = <T extends unknown>(list: T[], startIndex: number, endIndex: number): T[] => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination)
            return;

        const items = reorder(
            props.entries,
            result.source.index,
            result.destination.index
        );

        props.setEntries(items);
    };

    return <div className={"w-[300px] h-full flex flex-col border-l border-gray-500"}>
        {
            panelShowed && <CourseAddPanel showed={panelShowed}
                                           term={props.term}
                                           setShowed={setPanelShowed}
                                           courseCatalog={props.catalog}
                                           selections={props.entries}
                                           addSelection={(sel: CourseSelection) => props.setEntries([
                                               ...props.entries,
                                               sel
                                           ])}/>
        }
        <div className={"h-0 grow overflow-y-scroll relative"}>
            {
                scopedEntries.length === 0 &&
                <div
                    className={"w-full h-full flex flex-col place-items-center place-content-center gap-2 opacity-40"}>
                    <img src={"koala_1f428.png"} width={100} alt={"moai"}/>
                    <div>未有喺{props.term}新增任何課程</div>
                </div>
            }
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {
                                scopedEntries.map((sel, index) => {
                                        const course = props.catalog.find(c => sel.code == c.code && sel.term == c.term)!;
                                        return <SelectionCard
                                            course={course}
                                            index={index}
                                            key={index}
                                            curSubclass={sel.subclass}
                                            onPreview={(subclass: string | null) => {
                                                props.setPreview(!subclass ? null : {
                                                    code: sel.code,
                                                    term: sel.term,
                                                    subclass
                                                });
                                            }}
                                            onSelect={(subclass: string | null) => {
                                                if (!subclass) {
                                                    const idx = props.entries.findIndex(selection => course.code == selection.code);
                                                    const arr = [...props.entries];
                                                    arr.splice(idx, 1);
                                                    props.setEntries(arr);
                                                } else {
                                                    props.setEntries(props.entries.map(selection => course.code == selection.code ?
                                                        Object.assign({}, selection, {subclass: subclass!})
                                                        : selection));
                                                }
                                            }}/>;
                                    }
                                )
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
        <div className={"p-4"}>
            <Button variant="outlined" onClick={() => setPanelShowed(true)} fullWidth
                    startIcon={<MdAddCircle/>}>新增課程</Button>
        </div>
    </div>;
}
