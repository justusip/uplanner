import moment from "moment/moment";

export default class Interval {
    weekDay: number;
    hour: number;
    minute: number;

    constructor(moment: moment.Moment) {
        this.weekDay = moment.isoWeekday();
        this.hour = moment.hour();
        this.minute = moment.minute();
    }

    sameAs(moment: moment.Moment) {
        return moment.weekday() === this.weekDay && moment.hour() === this.hour && moment.minute() === this.minute;
    }

    eOrLThan(o: Interval) {
        if (this.weekDay !== o.weekDay)
            return false;
        return (this.hour * 60 + this.minute) >= (o.hour * 60 + o.minute);
    }
}
