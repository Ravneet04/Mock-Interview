import React from 'react'
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const InterviewItemCard = ({interview}) => {

    const router = useRouter()
    const onStart = ()=>{
        router.push("/dashboard/interview/"+interview?.mockid)
    }
    const onFeedback = ()=>{
        router.push("/dashboard/interview/"+interview?.mockid+"/feedback")
    }
  return (
    <div className="border border-gray-500 shadow-sm rounded-lg p-3" >
        <h2 className='font-bold text-primary' >{interview?.jobposition}</h2>
        <h2 className='text-sm text-gray-600' >{interview?.jobexperience} Years of experience</h2>
        <h2 className="text-xs text-gray-400" >Created At: {interview.createdat}</h2>

        <div className='flex justify-between mt-2 gap-5 ' >
            <Button onClick={onFeedback} size="sm"  className="w-full" >Feedback</Button>
            <Button onClick={onStart} size="sm"  className="w-full">Start</Button>
        </div>
    </div>

  )
}

export default InterviewItemCard