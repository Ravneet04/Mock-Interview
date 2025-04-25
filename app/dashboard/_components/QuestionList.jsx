"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { Question } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import QuestionItemCard from "./QuestionItemCard";
import { Skeleton } from "@/components/ui/skeleton";

const QuestionList = () => {
  const { user } = useUser();
  const [questionList, setQuestionList] = useState([]);

  useEffect(() => {
    user && GetQuestionList();
  }, [user]);

  const GetQuestionList = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      console.error("User email is undefined");
      return;
    }
  
    try {
      console.log("Fetching questions for:", user.primaryEmailAddress.emailAddress);
      
      const result = await db
        .select()
        .from(Question)
        .where(eq(Question.createdby, String(user.primaryEmailAddress.emailAddress)))
        .orderBy(desc(Question.id));
  
      console.log("Query result:", result);
      setQuestionList(result);
    } catch (error) {
      console.error("Database query error:", error);
    }
  };
  
  return (
    <div>
      {questionList.length > 0 ? (
        <>
          <h2 className="font-medium text-xl">Previous Mock Interview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
            {questionList.map((question, index) => (
              <QuestionItemCard key={index} question={question} />
            ))}
          </div>
        </>
      ) : (
        <div className="my-10 flex flex-col gap-5">
          <Skeleton className="w-full sm:w-[20rem] h-10 rounded-full animate-pulse bg-gray-300" />
          <Skeleton className="w-full sm:w-[20rem] h-10 rounded-full animate-pulse bg-gray-300" />
        </div>
      )}
    </div>
  );
};

export default QuestionList;
