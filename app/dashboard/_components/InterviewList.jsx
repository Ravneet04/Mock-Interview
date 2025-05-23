"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import InterviewItemCard from "./InterviewItemCard";
import { Skeleton } from "@/components/ui/skeleton"


const InterviewList = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      console.error("User email is undefined");
      return;
    }
  
    try {
      console.log("Fetching for user:", user.primaryEmailAddress.emailAddress);
      
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdby, String(user.primaryEmailAddress.emailAddress)))
        .orderBy(desc(MockInterview.id));
  
      console.log("Query result:", result);
      setInterviewList(result);
    } catch (error) {
      console.error("Database query error:", error);
    }
  };
  return (
    <div>
      <h2 className="font-medium text-xl">Previous Mock Interview</h2>
  
      {interviewList ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
          {interviewList.map((interview, index) => (
            <InterviewItemCard key={index} interview={interview} />
          ))}
        </div>
      ) : (
        <Skeleton className="w-[100px] h-[20px] rounded-full" />
      )}
    </div>
  );
};

export default InterviewList;
