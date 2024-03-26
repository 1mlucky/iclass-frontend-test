export interface User
{
    user_id: number;
    school_id: number;
    role_id: number;
    position_id: number;
    staff_number: string;
    username: string;
    password: string;
    name_en: string;
    name_tc: string;
    nickname: string;
    email: string;
    card_number: string;

    start_date: string | Date;
    end_date: string | Date;

    created_at: Date;

    avatar?: string;
}
