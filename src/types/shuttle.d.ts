/*
   Copyright 2025 Champlain API Authors

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/
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
    lat: number
    lon: number
    mph: number
    direction: number
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