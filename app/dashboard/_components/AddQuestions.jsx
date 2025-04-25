"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { chatSession } from "@/utils/GeminiAIModal";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { Question } from "@/utils/schema";
import { useRouter } from "next/navigation";

const AddQuestions = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [typeQuestion, setTypeQuestion] = useState("");
  const [company, setCompany] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleInputChange = (setState) => (e) => {
    setState(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const inputPrompt = `
    Generate 5 interview questions and answers based on the following details:
    - Job Position: ${jobPosition}
    - Job Description: ${jobDesc}
    - Years of Experience: ${jobExperience}
    - Type of Questions: ${typeQuestion}
    - Company: ${company}
    
    Format the response as a valid JSON array with objects:
    [
      { "Question": "Your question here", "Answer": "Corresponding answer here" },
      ...
    ]
    `;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      let jsonResponse = result.response.text();

      // Ensure clean JSON
      jsonResponse = jsonResponse.replace(/```json|```/g, "").trim();

      // Attempt to parse JSON
      const parsedResponse = JSON.parse(jsonResponse);
      if (!Array.isArray(parsedResponse)) {
        throw new Error("Invalid JSON format. Expected an array.");
      }

      // Save to database
      const resp = await db
        .insert(Question)
        .values({
          mockid: uuidv4(),
          mockquestionjsonresp: JSON.stringify(parsedResponse),
          jobposition: jobPosition,
          jobdesc: jobDesc,
          jobexperience: jobExperience,
          typequestion: typeQuestion,
          company: company,
          createdby: user?.primaryEmailAddress?.emailAddress,
          createdat: moment().format("YYYY-MM-DD"),
        })
        .returning({ mockId: Question.mockid });

      if (resp) {
        setOpenDialog(false);
        router.push(`/dashboard/pyq/${resp[0]?.mockId}`);
      }
    } catch (error) {
      console.error("Failed to parse JSON:", error.message);
      alert("There was an error processing the AI-generated data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 rounded-lg border bg-secondary hover:scale-105 hover:shadow-sm transition-all cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className=" text-lg text-center">+ Add New Questions</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What model questions are you seeking?</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div className="my-3">
                  <h2>Add details about your job position, job description, and experience.</h2>
                  <div className="mt-7 my-3">
                    <label className="text-black">Job Role / Job Position</label>
                    <Input
                      className="mt-1"
                      value={jobPosition}
                      placeholder="Ex. Full Stack Developer"
                      required
                      onChange={handleInputChange(setJobPosition)}
                    />
                  </div>
                  <div className="my-4">
                    <label className="text-black">Job Description / Tech Stack</label>
                    <Textarea
                      value={jobDesc}
                      placeholder="Ex. React, Angular, Node.js, MySQL, NoSQL, Python"
                      required
                      onChange={handleInputChange(setJobDesc)}
                    />
                  </div>
                  <div className="my-4">
                    <label className="text-black">Type of Questions</label>
                    <Input
                      value={typeQuestion}
                      placeholder="Ex. C++, Leetcode, Domain-based"
                      required
                      onChange={handleInputChange(setTypeQuestion)}
                    />
                  </div>
                  <div className="my-4">
                    <label className="text-black">Company</label>
                    <Input
                      value={company}
                      placeholder="Ex. Microsoft, Apple, Google, Mercedes"
                      required
                      onChange={handleInputChange(setCompany)}
                    />
                  </div>
                  <div className="my-4">
                    <label className="text-black">Years of Experience</label>
                    <Input
                      placeholder="Ex. 5"
                      value={jobExperience}
                      type="number"
                      required
                      onChange={handleInputChange(setJobExperience)}
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
                        Generating From AI...
                      </>
                    ) : (
                      "Prep. Questions"
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

export default AddQuestions;
