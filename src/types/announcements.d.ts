export type Announcement = {
    id: number
    title: string
    description: string
    style: "info" | "emergency"
    type: "Mobile" | "Shuttle" | "WWW"
}

/**
 * @description The Champlain Announcement object.
 * @deprecated Use {@link Announcement}
 */
export type _ChamplainAnnouncement = {
    id: number
    title: string
    summary: string
    style: "info" | "emergency"
    type: "Mobile" | "Shuttle" | "WWW"
}
