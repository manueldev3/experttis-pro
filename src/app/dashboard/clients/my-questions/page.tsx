import Routes from "@/models/routes";
import MainClientLayout from "../../clients/main/client/MainClientLayout";
import ClientQuestionPage from "./client/page";

function Page() {
    return (
        <MainClientLayout
            currentPage={Routes.consultants.dashboard}
        >
            <ClientQuestionPage />
        </MainClientLayout>
    );
}

export default Page;