"use client";

import { useState } from "react";
import Action from "@/components/action/action";
import Form from "@/components/action/form";
import Result from "@/components/action/result";
import Loading from "@/components/utils/loading";
import {llmRes, modelRes} from "@/components/action/form"

export default function Container() {
  const [step, setStep] = useState(1); // Track the current step
  const [res, setRes]= useState<[llmRes, modelRes]>();
 

  return (
    <div className="h-screen">
      {/* <ActionNav /> */}

      <div className="flex justify-center items-center w-full h-screen">
        <div className="w-full">
          {step === 1 && <Action onNext={() => setStep(2)} />}
          {step === 2 && <Form onNext={() => setStep(3)} setRes={setRes} />}
          {step === 3 && <Loading onComplete={() => setStep(4)} />}
          {step === 4 && <Result res={res!} />}
        </div>
      </div>

      {/* <p className="text-center text-white/61 font-inter">
        Copyright &copy; 2025 DeMol. All Rights Reserved.
      </p> */}
    </div>
  );
}
