export default interface Metadata {
    institutions: {
        name: string,
        years: { year: string, file: string }[]
    }[];
}
