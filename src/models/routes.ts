export default class Routes {
  // Concultants
  static root = "/";
  static browseSearchNull = "/browse-experts";
  static browseSearch(value: string) {
    return `/browse-experts?search=${value}`;
  }
  static consultants = class RoutesConsultants {
    static login = "/auth/login/consultants";
    static register = "/auth/register/consultants";
    static dashboard = "/dashboard/consultants/main";
    static profile = "/dashboard/consultants/profile";
    static schedule = "/dashboard/consultants/schedule";
    static chat = "/dashboard/consultants/chat";
  };
  static clients = class RoutesConsultants {
    static register = "/auth/register/clients";
    static login = "/auth/login/clients";

    static dashboard = "/dashboard/clients/main";
    static myQuestions = "/dashboard/clients/my-questions";
    static profile = "/dashboard/clients/profile";
    static chat = "/dashboard/clients/chat";
    static consultancies = "/dashboard/clients/consultancies";
  };
}
