import moment from "moment/moment";

export default interface Lesson {
    code: string,
    term: string,
    subclass: string,
    title: string,
    venue: string,
    from: moment.Moment,
    to: moment.Moment,
    isPreview: boolean
}
