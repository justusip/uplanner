import moment from "moment";

export default interface Course {
    code: string,
    term: string,
    title: string,
    sections: {
        sectionName: string,
        times: {
            from: moment.Moment,
            to: moment.Moment,
            venue: string,
        }[]
    }[]
}
