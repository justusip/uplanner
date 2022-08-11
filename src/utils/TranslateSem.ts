export default function TranslateSem(semId: string): string {
    const sems = [
        {
            name: "Sem 1",
            id: "s1"
        },
        // {
        //     name: "WIN SEM",
        //     id: "ws",
        //     disabled: true
        // },
        {
            name: "Sem 2",
            id: "s2"
        },
        {
            name: "Sum Sem",
            id: "ss"
        }
    ];
    const sem = sems.find(o => o.id === semId);
    if (sem) return sem.name;
    return "?";
}
