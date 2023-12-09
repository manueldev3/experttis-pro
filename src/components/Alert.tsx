"use client";
import { Alert, notification } from "antd";
import { auth } from "@/firebase/config";
import { sendEmailVerification } from "firebase/auth";
import { Button } from "react-bootstrap";

export default function AlertComponent() {
  return (
    <Alert
      className="not-verify-email"
      type="info"
      message="Please check the email we just sent and click the
            confirmation link to continue the registration process."
      action={<Button
        onClick={async () => {
          try {
            await sendEmailVerification(auth.currentUser!);
            notification.success({
              message: "Sended email successfully",
              description: `
                      We have sent a verification email to the
                      email ${auth.currentUser?.email || ""}
                    `,
            });
          } catch (e: any) {
            notification.error({
              message: e.code,
              description: e.message,
              placement: "topRight",
            })
          }
        }}
      >
        Resend mail
      </Button>}
    />
  )
}