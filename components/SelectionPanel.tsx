import React from "react";
import Course from "../types/Course";
import CourseSelection from "../types/CourseSelection";
import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import SelectionCard from "./SelectionCard";
import CourseAddPanel from "./CourseAddPanel";
import {Button} from "@mui/material";
import {MdAddCircle} from "react-icons/md";
import TranslateSem from "../utils/TranslateSem";

export default function SelectionPanel(props: {
    term: string,
    catalog: Course[],
    entries: CourseSelection[],
    setEntries: (entries: CourseSelection[]) => void,
    setPreview: (subclass: CourseSelection | null) => void
}) {

    const scopedEntries = React.useMemo(() => props.entries.filter(s => s.term === props.term), [props.entries, props.term]);
    const [panelShowed, setPanelShowed] = React.useState(false);

    const reorder = (list: CourseSelection[], sourceIdx: number, destinationIdx: number): CourseSelection[] => {
        const thisTermSelections = list.filter(o => o.term === props.term);
        const otherTermSelections = list.filter(o => o.term !== props.term);

        const [removed] = thisTermSelections.splice(sourceIdx, 1);
        thisTermSelections.splice(destinationIdx, 0, removed);

        return [...thisTermSelections, ...otherTermSelections];
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
                <div className={"w-full h-full flex flex-col place-items-center place-content-center gap-2 opacity-40"}>
                    <img src={"koala_1f428.png"} width={100} alt={"koala"}/>
                    <div>未有新增任何{TranslateSem(props.term)}嘅課程</div>
                </div>
            }
            {
                props.catalog && <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {
                                    scopedEntries.map((entry, index) => {
                                            const course = props.catalog.find(o => entry.code === o.code && entry.term === o.term)!;
                                            return <SelectionCard
                                                course={course}
                                                index={index}
                                                key={index}
                                                curSubclass={entry.subclass}
                                                onSelectSubclass={(subclass: string) => {
                                                    props.setEntries(props.entries.map(o => course.code === o.code && course.term === o.term ?
                                                        Object.assign({}, o, {subclass: subclass!}) : o));
                                                }}
                                                onRemoveCourse={() => {
                                                    const idx = props.entries.findIndex(o => course.code === o.code && course.term === o.term);
                                                    const arr = [...props.entries];
                                                    arr.splice(idx, 1);
                                                    props.setEntries(arr);
                                                }}
                                                onPreviewSubclass={(subclass: string | null) => {
                                                    props.setPreview(!subclass ? null : {
                                                        code: entry.code,
                                                        term: entry.term,
                                                        subclass
                                                    });
                                                }}
                                            />;
                                        }
                                    )
                                }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            }
        </div>
        <div className={"p-4 border-t border-gray-500"}>
            <Button variant="outlined" onClick={() => setPanelShowed(true)} fullWidth
                    startIcon={<MdAddCircle/>}>新增{TranslateSem(props.term)}嘅課程</Button>
        </div>
    </div>;
}
