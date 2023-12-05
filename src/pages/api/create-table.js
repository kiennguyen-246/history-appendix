import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const runtime = "edge";

export default async function handle({ req, res }) {
    const result1 = await sql`
                CREATE TABLE IF NOT EXISTS Books (
                    bookCode VARCHAR(10) NOT NULL PRIMARY KEY,
                    bookName VARCHAR(255) NOT NULL
                );`;
    const result2 = await sql`;
                CREATE TABLE IF NOT EXISTS Keywords (
                    keywordCode VARCHAR(255) NOT NULL PRIMARY KEY,
                    keyword VARCHAR(255) NOT NULL,
                    content VARCHAR(2047) NOT NULL,
                    image BYTEA,
                    pageNumber VARCHAR(20) NOT NULL,
                    topic VARCHAR(20) NOT NULL,
                    bookCode VARCHAR(10) NOT NULL,
                    FOREIGN KEY (bookCode) REFERENCES Books(bookCode)
                );`;
    const result3 = await sql`CREATE TABLE IF NOT EXISTS Feedbacks (
                    id INT NOT NULL PRIMARY KEY,
                    email VARCHAR(255) NOT NULL,
                    feedback VARCHAR(2047) NOT NULL
                );`;
    return NextResponse.json({ result1, result2, result3 }, { status: 200 });
}
