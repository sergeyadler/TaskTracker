import CurrentUserDetails from "../features/user/components/CurrentUserDetails.tsx";
import {ToastProvider} from "../components/ui/Toast.tsx";

export default function Profile() {
    return (
        <ToastProvider>

            <main className="container mx-auto px-4 py-8">
                <h1 className="mb-6 text-2xl font-semibold">Profile</h1>
                <CurrentUserDetails/>
            </main>
        </ToastProvider>
    );
}