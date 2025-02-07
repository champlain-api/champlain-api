/**
 * @description
 * The Shuttle object that our API is returning.
 * This one is different from the Champlain one because it cleans up
 * some unused fields and changes some existing ones.
 * Ours does not include the Unit_Name or Unit_Operator
 * We also change Knots to MPH.
 */
export type Shuttle = {
    updated: Date,
    id: number,
    lat: string
    lon: string
    mph: string
    direction: string
}


/**
 * @description This is the Champlain shuttle object.
 * @see {@link Shuttle} for the Shuttle that we are returning.
 */
export type _ChamplainShuttle = {
    Date_Time: string
    Date_Time_ISO: string
    UnitID: string
    Unit_Name: string | Object // the newer buses have empty objects as the name.
    Unit_Operator: string
    Lat: string
    Lon: string
    Knots: string
    Direction: string
}