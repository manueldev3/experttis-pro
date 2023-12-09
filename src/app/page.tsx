import { Fragment } from "react";
import '@/styles/globals.scss';

/* Firebase */
import { auth } from "@/firebase/config";
import initFirebase from "@/firebase/adminConfig";
import admin from "firebase-admin";

/* Components */
import AlertComponent from "@/components/Alert";
import Carrousel from "@/components/home/Carrousel";
import Search from "@/components/home/Search";
import Enjoy from "@/components/home/Enjoy";
import Features from "@/components/home/Features";
import Works from "@/components/home/Works";
import Consultancy from "@/components/home/Consultancy";
import Academic from "@/components/home/Academic";
import SubscriptionSection from "@/components/home/Subscription";
import ConsultantSelection from "@/components/home/ConsultantSelection";
import Friendly from "@/components/home/Friendly";
import Asistance from "@/components/home/Asistance";

/* Models */
import Subscription from "@/models/subscription";

async function getData(): Promise<Subscription[]> {
  initFirebase();

  const _query = await admin.firestore().collection(Subscription.collectionPath)
    .where("active", "==", true).orderBy("position", "asc").get();

  const subscriptions = [];

  for (const document of _query.docs) {
    subscriptions.push(new Subscription({
      ...document.data() as Subscription,
      id: document.id,
    }));
  }

  return subscriptions;
}

export default async function Home() {
  const subscriptions: Subscription[] = await getData();

  return (
    <Fragment>
      {auth.currentUser && !auth.currentUser.emailVerified &&
        <AlertComponent />
      }
      <Carrousel />
      <Search />
      <Enjoy />
      <Features />
      <Works />
      <Consultancy />
      <Academic />
      <Friendly />
      <SubscriptionSection subscriptions={subscriptions} />
      <ConsultantSelection />
      <Asistance />
    </Fragment>
  )
}