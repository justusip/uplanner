import React from "react";
import Course from "../types/Course";
import CourseSelection from "../types/CourseSelection";
import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import SelectionCard from "./SelectionCard";
import CourseAddPanel from "./CourseAddPanel";

export default function SelectionPanel(props: {
    courseCatalog: Course[],
    selections: CourseSelection[],
    setSelections: (sections: CourseSelection[]) => void
}) {

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
            props.selections,
            result.source.index,
            result.destination.index
        );

        props.setSelections(items);
    };

    return <div className={"w-[300px] h-full flex flex-col border-l"}>
        {
            panelShowed && <CourseAddPanel showed={panelShowed}
                                           setShowed={setPanelShowed}
                                           courseCatalog={props.courseCatalog}
                                           selections={props.selections}
                                           addSelection={(sel: CourseSelection) => props.setSelections([
                                               ...props.selections,
                                               sel
                                           ])}/>
        }
        <div className={"h-0 grow overflow-y-scroll relative bg-white bg-opacity-20"}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div {...provided.droppableProps}
                             ref={provided.innerRef}>
                            {
                                props.selections.map((sectionSelection, index) => {
                                        const course = props.courseCatalog.find(c => sectionSelection.code == c.code && sectionSelection.term == c.term)!;
                                        return <SelectionCard
                                            course={course}
                                            index={index}
                                            key={index}
                                            sectionName={sectionSelection.sectionName}
                                            setSection={(section: string | null) => {
                                                if (!section) {
                                                    const idx = props.selections.findIndex(selection => course.code == selection.code);
                                                    const arr = [...props.selections];
                                                    arr.splice(idx, 1);
                                                    props.setSelections(arr);
                                                } else {
                                                    props.setSelections(props.selections.map(selection => course.code == selection.code ?
                                                        Object.assign({}, selection, {sectionName: section!})
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
        <div className={"p-2"}>
            <button className={"border p-2 w-full"}
                    onClick={() => setPanelShowed(true)}>
                Add a course...
            </button>
        </div>
    </div>;
}
