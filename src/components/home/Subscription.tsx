"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "react-bootstrap";
import Subscription from "@/models/subscription"
import StripeController from "@/services/stripe/index";

/* Assets */
import nutDarkBlue from "@/assets/icons/nut-dark-blue.svg";

export interface SubscriptionSectionProps {
  subscriptions: Subscription[];
}

export default function SubscriptionSection({ subscriptions }: SubscriptionSectionProps) {
  const router = useRouter();

  const [loaders, setLoaders] = useState<boolean[]>([
    ...subscriptions.map((item) => false),
  ]);

  const goToSubscribe = (slug: string, id?: string) => {
    setLoaders([
      ...subscriptions.map((item) => {
        if (item.id === id) {
          return true;
        }
        return false;
      }),
    ]);

    router.push(`/auth/register/clients/${slug}/${id}`);
  }

  return (
    <section id="subscriptions" className="subscription">
      <h2 className="title">
        PLANS
      </h2>
      <Image
        src={nutDarkBlue}
        width={54}
        height={54}
        alt="Nut Light Blue"
      />
      <h2 className="subtitle">
        <span>SUBSCRIBE</span> AND ENJOY THE BENEFITS
      </h2>
      <div className="subscriptions">
        {subscriptions.map((item, index) => {
          switch (item.type) {
            case "single":
              return (
                <div
                  key={index}
                  className="individual"
                >
                  <h2 className="title">{item.title}</h2>
                  <div className="content">
                    <Image
                      src={item.imageURL ?? ""}
                      width={218}
                      height={200}
                      alt=""
                    />
                    <h4 className="price">
                      {item.visiblePrice}
                    </h4>
                    <ul className="p-0 m-0">
                      {item.items.map((i, index) => (
                        <li key={index}>{i}</li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => goToSubscribe(item.slug, item.id)}
                  >
                    {loaders[index] ? "LOADING..." : "CLICK AND SUBSCRIBE"}
                  </Button>
                  {/* <Button
                    size="lg"
                    onClick={() => StripeController.checkoutSubscription(item)}
                  >
                    {loaders[index] ? "LOADING..." : "CLICK AND SUBSCRIBE"}
                  </Button> */}
                </div>
              );
            case "multiple":
              return (
                <div
                  key={index}
                  className="business"
                >
                  <h2 className="title">{item.title}</h2>
                  <div className="content">
                    <h2 className="title">{item.subsubscriptions[0].title}</h2>
                    <h4 className="price">{item.subsubscriptions[0].visiblePrice}</h4>
                    <ul className="mx-0 my-2 p-0">
                      {item.subsubscriptions[0].items.map((item, index) => (
                        <li className="text-center" key={index}>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Image
                      src={item.imageURL ?? ""}
                      width={218}
                      height={200}
                      alt=""
                    />
                    <h2 className="title" style={{ paddingTop: 8 }}>{item.subsubscriptions[1].title}</h2>
                    <h4 className="price">{item.subsubscriptions[1].visiblePrice}</h4>
                    <ul className="mx-0 my-2 p-0">
                      {item.subsubscriptions[1].items.map((item, index) => (
                        <li className="text-center" key={index}>
                          {item}
                        </li>
                      ))}
                    </ul>
                    {/*    <p className="description">
                      {item.subsubscriptions[1].description}
                    </p> */}
                  </div>
                  <Button
                    size="lg"
                    onClick={() => goToSubscribe(item.slug, item.id)}
                  >
                    {loaders[index] ? "LOADING..." : "CLICK AND SUBSCRIBE"}
                  </Button>
                </div>
              );
            case "dual":
              return (
                <div
                  key={index}
                  className="academic"
                >
                  <h2 className="title">Academic</h2>
                  <div className="plans">
                    <div className="institution">
                      <div className="content">
                        <Image
                          src={item.imageURL ?? ""}
                          width={218}
                          height={200}
                          alt=""
                        />
                        <div className="space">
                          <h2 className="title">
                            {item.subsubscriptions[0].title}
                          </h2>
                          <h4 className="price">
                            {item.subsubscriptions[0].visiblePrice}
                          </h4>
                        </div>
                        <p className="description">
                          {item.subsubscriptions[0].description}
                        </p>
                      </div>
                      <Button
                        size="lg"
                        onClick={() => item.subsubscriptions[0].customLink ?
                          router.push(item.subsubscriptions[0].customLink)
                          : goToSubscribe(item.subsubscriptions[0].slug, item.id)}
                      >
                        {loaders[index] ? "LOADING..." : "CLICK AND SUBSCRIBE"}
                      </Button>
                    </div>
                    <div className="space"></div>
                    <div className="students">
                      <div className="content">
                        <div className="space">
                          <h2 className="title">
                            {item.subsubscriptions[1].title}
                          </h2>
                          <h4 className="price">
                            FREE SUBSCRIPTION
                          </h4>
                        </div>
                        <Image
                          src={item.imageURL ?? ""}
                          width={218}
                          height={200}
                          alt=""
                        />
                        <p className="description">
                          {item.subsubscriptions[1].description}
                        </p>
                        <ul className="m-0 p-0">
                          {item.subsubscriptions[1].items.map((item, index) => (
                            <li className="text-center" key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        size="lg"
                        onClick={() => item.subsubscriptions[1].customLink ?
                          router.push(item.subsubscriptions[1].customLink)
                          : goToSubscribe(item.subsubscriptions[1].slug, item.id)}
                      >
                        {loaders[index] ? "LOADING..." : "CLICK AND SUBSCRIBE"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            default: return <div key={index}></div>
          }
        })}
      </div>
    </section>
  );
}