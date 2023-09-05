export interface NotificationRequestStrategy {
    execute(user: any): Promise<void>;
}