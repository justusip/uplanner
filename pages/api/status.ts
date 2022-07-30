import type {NextApiRequest, NextApiResponse} from 'next';
import Metadata from "../../types/Metadata";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Metadata>
) {
    res.json({
        institutions: [
            {
                name: "香港大學",
                years: [
                    {
                        year: "2022-2023",
                        file: "data/hku_2022-2023.json"
                    }
                ]
            }
        ]
    });
}
