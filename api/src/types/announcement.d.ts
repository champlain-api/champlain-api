export type Announcement = {
    id: number,
    updated: Date,
    title: string,
    description: string,
    type: AnnouncementType[]
    style: AnnouncementStyle
}

export enum AnnouncementType {
    "EMERGENCY",
    "INFO"
}

export enum AnnouncementStyle {
    "WEB",
    "SHUTTLE",
    "MOBILE"
}