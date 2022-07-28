import Interval from "./Interval";

export default interface RecurringLesson {
    code: string,
    term: string,
    subclass: string,
    title: string,

    //Times with same interval may have different venue?
    //1st week thurs 10am-11am may be at place A, but 2nd week thurs 10am-11am may be at place B (but extremely rare)
    venue: string[],

    from: Interval,
    to: Interval,

    isConflict: boolean,
    isPreview: boolean
}
