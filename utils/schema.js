import { serial, text, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockinterview', {
    id: serial('id').primaryKey(),
    jsonmockresp: text('jsonMockResp').notNull(),
    jobposition: varchar('jobPosition').notNull(),
    jobdesc: varchar('jobDesc').notNull(),
    jobexperience: varchar('jobExperience').notNull(),
    createdby: varchar('createdBy').notNull(),
    createdat: varchar('createdAt'),
    mockid: varchar('mockId').notNull()
});

export const Question = pgTable('question', {
    id: serial('id').primaryKey(),
    mockquestionjsonresp: text('MockQuestionJsonResp').notNull(),
    jobposition: varchar('jobPosition').notNull(),
    jobdesc: varchar('jobDesc').notNull(),
    jobexperience: varchar('jobExperience').notNull(),
    typequestion: varchar('typeQuestion').notNull(),
    company: varchar('company').notNull(),
    createdby: varchar('createdBy').notNull(),
    createdat: varchar('createdAt'),
    mockid: varchar('mockId').notNull()
});



export const UserAnswer = pgTable('userAnswer',{
    id: serial('id').primaryKey(),
    mockidref: varchar('mockId').notNull(),
    question: varchar('question').notNull(),
    correctans: text('correctAns'),
    userans: text('userAns'),
    feedback: text('feedback'),
    rating: varchar('rating'),
    useremail: varchar('userEmail'),
    createdat: varchar('createdAt')
})

export const Newsletter = pgTable('newsletter',{
    id: serial('id').primaryKey(),
    newname: varchar('newName'),
    newemail: varchar('newEmail'),
    newmessage: text('newMessage'),
    createdat: varchar('createdAt')
})