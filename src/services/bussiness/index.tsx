import BusinessType from "@/models/business-type";
import { notification } from "antd";
import { DocumentData, getDocs, query, where } from "firebase/firestore";

// Business type controller
export default class BusinessTypeController {
  static async getAll(): Promise<BusinessType[]> {
    let results: BusinessType[] = [];
    try {
      const businessTypeDocs: DocumentData = await getDocs(
        query(
          BusinessType.collection,
          where('default', '==', true),
        ),
      );

      results = businessTypeDocs.docs.map((document: DocumentData) => {
        return {
          ...document.data() as BusinessType,
          id: document.id,
        };
      });
    } catch (error: any) {
      notification.error({
        message: error.toString(),
      });
    }

    return results;
  }
}