export interface UserDto {
    id?: number;
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
    location: string;
    title: string;
    websiteLink: string;
    twitterUsername: string;
    githubUsername: string;
    password: string;
    confirmPasword?: string;
}