'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { verify } from "./actions/verify";

export default function Home() {
  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_WLD_ACTION;
  const router = useRouter();

  if (!app_id) {
    throw new Error("app_id is not set in environment variables!");
  }
  if (!action) {
    throw new Error("action is not set in environment variables!");
  }

  const { setOpen } = useIDKit();

  const onSuccess = (result: ISuccessResult) => {
    window.alert(
      "Successfully verified with World ID! Your nullifier hash is: " +
      result.nullifier_hash
    );
    router.push("/home");
  };

  const handleProof = async (result: ISuccessResult) => {
    console.log(
      "Proof received from IDKit, sending to backend:\n",
      JSON.stringify(result)
    );
    const data = await verify(result);
    if (data.success) {
      console.log("Successful response from backend:\n", JSON.stringify(data));
    } else {
      throw new Error(`Verification failed: ${data.detail}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-bg">
      <Image
        src="/images/ad.svg"
        alt="Ad Image"
        width={150}
        height={150}
        className="mb-6"
      />
      <Image
        src="/images/cube.svg"
        alt="Cube Image"
        width={150}
        height={150}
        className="mb-6"
      />
      <Image
        src="/images/verify.svg"
        alt="Start Image"
        width={300}
        height={300}
        className="mb-2"
      />
      
      <IDKitWidget
        action={action}
        app_id={app_id}
        onSuccess={onSuccess}
        handleVerify={handleProof}
        verification_level={VerificationLevel.Device}
      />
      <button
        className="btn bg-btn text-btn-blue w-64 mb-4 shadow-lg mt-4"
        onClick={() => setOpen(true)}
      >
        Verify with World ID
      </button>
    </div>
  );
}
