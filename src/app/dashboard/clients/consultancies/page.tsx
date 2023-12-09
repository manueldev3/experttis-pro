import Routes from "@/models/routes";
import MainClientLayout from "../../clients/main/client/MainClientLayout";
import ClientConsultanciesPage from "./client/page";

function Page() {
    return (
        <MainClientLayout
            currentPage={Routes.consultants.dashboard}
        >
            <ClientConsultanciesPage />
        </MainClientLayout>
    );
}

export default Page;