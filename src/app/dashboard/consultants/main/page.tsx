import Routes from "@/models/routes";
import ConsultantsMainPage from "./client/page";
import MainLayout from "./client/MainLayout";

function Page() {
    return (
        <MainLayout
            currentPage={Routes.consultants.dashboard}
        >
            <ConsultantsMainPage />
        </MainLayout>
    );
}

export default Page;
