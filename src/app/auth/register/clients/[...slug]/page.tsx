import admin from "firebase-admin";
import initFirebase from "@/firebase/adminConfig";
import Subscription from "@/models/subscription";
import FormRegistreClient from "@/components/auth/register/clients/form";

async function getSubscription(id: string): Promise<Subscription> {
  initFirebase();
  const document = await admin.firestore().collection(Subscription.collectionPath)
    .doc(id).get();

  return new Subscription({
    ...document.data() as Subscription,
    id: document.id,
  });
}

export default async function AuthRegisterClients({ params }: {
  params: {
    slug: string[],
  }
}) {
  if (params.slug.length < 2) return (
    <div>404</div>
  );
  const subscription = await getSubscription(params.slug[1]);
  return (
    <>
      <section className="registration">
        <h3>{subscription.title?.toUpperCase()} {
          subscription.subsubscriptions.length > 0 && subscription.subsubscriptions[0].title?.toUpperCase()
        } REGISTRATION</h3>
        <FormRegistreClient
          subscription={subscription}
        />
      </section>
    </>
  );
}