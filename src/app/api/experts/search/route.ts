import { NextResponse } from "next/server";
import admin from "firebase-admin";
import initFirebase from "@/firebase/adminConfig";
import { QuerySnapshot } from "firebase-admin/firestore";

initFirebase();

const professionsDB = admin.firestore().collection("professions");
const disciplinesDB = admin.firestore().collection("disciplines");
const usersDB = admin.firestore().collection("users");

export interface SearchExpertsPOST {
  search: string;
}

export async function POST(res: Request) {
  try {
    const body: SearchExpertsPOST = await res.json();
    const { search } = body;

    const professionsID: string[] = [];
    const disciplinesID: string[] = [];

    const professionsQuery = await professionsDB
      .where("searchIndex", "array-contains", search.toLowerCase())
      .get();

    professionsQuery.forEach((doc) => professionsID.push(doc.id));

    const disciplinesQuery = await disciplinesDB
      .where("searchIndex", "array-contains", search.toLowerCase())
      .get();

    disciplinesQuery.forEach((doc) => disciplinesID.push(doc.id));

    const users: object[] = [];
    let usersQuery;

    if (professionsID.length) {
      usersQuery = await usersDB
        .where(
          "professionalInfo.professions",
          "array-contains-any",
          professionsID
        )
        .get();

      for (const doc of usersQuery.docs) {
        const userRecord = await admin.auth().getUser(doc.id);

        users.push({
          ...userRecord,
          ...doc.data(),
        });
      }
    }

    if (disciplinesID.length) {
      usersQuery = await usersDB
        .where(
          "professionalInfo.disciplines",
          "array-contains-any",
          disciplinesID
        )
        .get();

      for (const doc of usersQuery.docs) {
        const userRecord = await admin.auth().getUser(doc.id);

        users.push({
          ...userRecord,
          ...doc.data(),
        });
      }
    }

    return NextResponse.json(
      users.map((user: any) => {
        return {
          uid: user.uid,
          displayName: user.displayName,
          avatar: user.photoUrl,
          languages:
            user.professionalInfo?.languages.map((item: any) => item.name) ||
            [],
          rate: user.rate || 0,
        };
      })
    );
  } catch (e: any) {
    return NextResponse.json(e as object, {
      status: 400,
    });
  }
}
