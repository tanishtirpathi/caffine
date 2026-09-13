export type BookingRequest = {
    venueId: string;
    startingTime: string;
    endingTime: string;
    reason: string;
    numberOfStudents: number;
    date: string;
    resources: string[];
};

export type BookingTime = 
    | "09:00"
    | "10:00"
    | "11:00"
    | "12:00"
    | "13:00"
    | "14:00"
    | "15:00"
    | "16:00"
    | "17:00";