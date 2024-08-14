interface ConfigManagementResponse {
    id: number;
    email_host: string;
    email_port: number;
    email_host_user: string;
    email_host_password: string;
    company_api_key: string;
    super_admin_username: string;
    api_url: string;
    sendgrid_api_key: string;
    twilio_account_sid: string;
    twilio_auth_token: string;
    twilio_sid: string;
    twilio_number: string;
    postgres_db_name: string;
    postgres_db_user: string;
    postgres_db_password: string;
    postgres_db_host: string;
    postgres_db_port: number;
    environment: string;
    jwt_secret_key: string;
    token_min_length: number;
    token_max_length: number;
    login_with_email: boolean;
    login_with_phone: boolean;
    under_maintenance: boolean;
    maintenance_template: string;
    time_to_remind_users: string;
}

interface UpdateConfigManagementRequest {
    email_host?: string;
    email_port?: number;
    email_host_user?: string;
    email_host_password?: string;
    company_api_key?: string;
    super_admin_username?: string;
    api_url?: string;
    sendgrid_api_key?: string;
    twilio_account_sid?: string;
    twilio_auth_token?: string;
    twilio_sid?: string;
    twilio_number?: string;
    postgres_db_name?: string;
    postgres_db_user?: string;
    postgres_db_password?: string;
    postgres_db_host?: string;
    postgres_db_port?: number;
    environment?: string;
    jwt_secret_key?: string;
    token_min_length?: number;
    token_max_length?: number;
    login_with_email?: boolean;
    login_with_phone?: boolean;
    under_maintenance?: boolean;
    maintenance_template?: string;
    time_to_remind_users?: string;
}
