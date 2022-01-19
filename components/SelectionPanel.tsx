import React from "react";
import Course from "./Course";
import CourseSelection from "./CourseSelection";
import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import {BsSearch} from "react-icons/bs";
import SelectionCard from "./SelectionCard";
import cx from "classnames";

export default function SelectionPanel(props: {
    courseCatalog: Course[],
    selections: CourseSelection[],
    setSelections: (sections: CourseSelection[]) => void
}) {

    const [query, setQuery] = React.useState<string>("");

    const curSem = "2021-22 Sem 2";

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
        <div className={"selection-searchbox"}>
            <BsSearch color={"#555"}/>
            <input className={"selection-searchbox-input"} value={query} onChange={e => setQuery(e.target.value)}
                   placeholder={"Search a course..."}/>
        </div>
        <div className={"h-0 grow overflow-y-scroll relative bg-white bg-opacity-20"}>
            {
                query != "" && <div className={"absolute w-full h-full top-0 left-0 bg-white"}>
                    {
                        props.courseCatalog
                            .filter(c => c.code.toLowerCase().startsWith(query.toLowerCase()))
                            .map((course, i) => {
                                const disabled = props.selections.find(s => s.code === course.code && s.term === course.term) || course.term != curSem;
                                return <div key={i}
                                            className={cx(
                                                "p-2 border border-b-neutral-300 cursor-pointer hover:bg-neutral-200",
                                                {"text-neutral-500 hover:bg-inherit cursor-not-allowed": disabled}
                                            )}
                                            onClick={() => {
                                                if (disabled)
                                                    return;
                                                props.setSelections([
                                                    ...props.selections,
                                                    {
                                                        code: course.code,
                                                        term: course.term,
                                                        sectionName: course.sections[0].sectionName
                                                    }
                                                ]);
                                                setQuery("");
                                            }}>
                                    <div className={"course-code"}>{course.code} {course.term}</div>
                                    <div className={"course-title"}>{course.title}</div>
                                </div>;
                            })
                    }
                </div>
            }
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
    </div>;
}
