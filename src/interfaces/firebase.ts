import User from "@/models/user";

export interface useAuthProps {
    onAuth: (currentUser: User) => {};
    onNotAuth: () => {};
}