import Routes from "@/models/routes";
import ClientMainPage from "./client/page";
import MainClientLayout from "./client/MainClientLayout";

function Page() {
    return (
        <MainClientLayout
            currentPage={Routes.consultants.dashboard}
        >
            <ClientMainPage />
        </MainClientLayout>
    );
}

export default Page;
