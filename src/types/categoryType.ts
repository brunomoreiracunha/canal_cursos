import * as Icons from "lucide-react";

export type IconName = keyof typeof Icons;

export type Category = {
    id: number;
    icon: IconName;
    title: string;
    name: string;
};
