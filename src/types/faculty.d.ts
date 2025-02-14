/**
 * @description This is the faculty object.
 * All the Info that is being returned.
 */

// export type Faculty = {
//     name: string;
//     title: string;
//     departments: string[];
//     imageUrl: string;
// }

export interface Faculty {
    id: number;
    name: string;
    department: string;
    email?: string;
    phone?: string;
}
