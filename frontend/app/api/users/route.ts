import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/connection";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import argon2 from "argon2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Create user
// Prisma error codes: P2002 = Unique constraint violation (e.g., duplicate email)
export async function POST(req:NextRequest) {
    const { password, ...body } = await req.json();
    const hashedPassword = await argon2.hash(password);
    try {
        const user = await prisma.user.create({
            data: {
                ...body,
                password: hashedPassword
             },
        })
        return  NextResponse.json(user, {status: 201})
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json(
                { message: "A user with this email already exists" },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { message: "Failed to create user" },
            { status: 500 }
        );
    }
}

// Delete user
// Prisma error codes: P2025 = Record not found
export async function DELETE(req:NextRequest) {
    const { id } = await req.json();
    try {
        const deletedUser = await prisma.user.delete({
            where: { id }
        })
        return NextResponse.json(deletedUser, {status: 200})
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: "Failed to delete user" },
            { status: 500 }
        );
    }
}

// Update user
// Prisma error codes: P2025 = Record not found
export async function PUT(req:NextRequest) {
    const { id, ...body } = await req.json();
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { updatedAt: new Date(), ...body }
        })
        return NextResponse.json(updatedUser, {status: 200})
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: "Failed to update user" },
            { status: 500 }
        );
    }
}

// Get all users
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const currentUserId = session?.user?.id;
        
        const allUsers = await prisma.user.findMany({
            where: currentUserId ? { id: { not: currentUserId } } : {},
            select: {
                id: true,
                fullName: true,
                email: true,
                image: true
            }
        });
        return NextResponse.json(allUsers, {status: 200})
    } catch {
        return NextResponse.json(
            { message: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
