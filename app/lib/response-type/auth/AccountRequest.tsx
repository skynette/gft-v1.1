export interface AccountRequest {
    first_name: string;
    last_name: string;
    username: string;
    mobile: string;
    contact_preference?: string;
    image?: string;
}