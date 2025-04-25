"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Job Details:", jobPosition, jobDesc, jobExperience);

    const inputPrompt = `
      Job Positions: ${jobPosition}, 
      Job Description: ${jobDesc}, 
      Years of Experience: ${jobExperience}. 
      Provide 5 interview questions with answers in JSON format with "Question" and "Answer" fields.
    `;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const responseText = result.response.text();
      const cleanedResponse = responseText.replace(/```json|```/g, "").trim();

      console.log("AI Response:", cleanedResponse);
      const parsedJson = JSON.parse(cleanedResponse);
      setJsonResponse(parsedJson);

      const mockId = uuidv4();
      const createdAt = moment().format("YYYY-MM-DD");
      console.log("MockInterview",MockInterview);
      const resp = await db
  .insert(MockInterview)
  .values({
    mockid: uuidv4(),
    jsonmockresp: cleanedResponse,  // ✅ Match the database column name (all lowercase)
    jobposition: jobPosition,
    jobdesc: jobDesc,
    jobexperience: jobExperience,
    createdby: user?.primaryEmailAddress?.emailAddress,
    createdat: moment().format("YYYY-MM-DD"),
  })
  .returning({ mockId: MockInterview.mockid });

      console.log("Inserted ID:", resp);

      if (resp.length > 0) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + resp[0].mockId);
      }
    } catch (error) {
      console.error("Error generating mock interview:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 rounded-lg border bg-secondary hover:scale-105 hover:shadow-sm transition-all cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div className="my-3">
                  <h2>Add details about your job position, description, and experience.</h2>

                  <div className="mt-7 my-3">
                    <label className="text-black">Job Role / Position</label>
                    <Input
                      className="mt-1"
                      placeholder="Ex. Full Stack Developer"
                      value={jobPosition}
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                    />
                  </div>

                  <div className="my-5">
                    <label className="text-black">Job Description / Tech Stack (Short)</label>
                    <Textarea
                      className="placeholder-opacity-50"
                      placeholder="Ex. React, Angular, Node.js, MySQL, NoSQL, Python"
                      value={jobDesc}
                      required
                      onChange={(e) => setJobDesc(e.target.value)}
                    />
                  </div>

                  <div className="my-5">
                    <label className="text-black">Years of Experience</label>
                    <Input
                      className="mt-1"
                      placeholder="Ex. 5"
                      type="number"
                      max="50"
                      value={jobExperience}
                      required
                      onChange={(e) => setJobExperience(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
                  <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        Generating AI Response...
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
