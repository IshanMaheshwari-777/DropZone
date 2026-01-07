# DropZone – Lost & Found Web Platform

DropZone is a production-ready, full-stack Lost & Found web application designed for college campuses. It allows users to post Lost and Found items, upload images for verification, and manage recovery workflows.

## Features

- **Public Visibility**: Browse all found and lost items without logging in.
- **Authentication**: Secure JWT-based authentication for reporting items.
- **Found Items**: Report found items with mandatory images.
- **Lost Items**: Report lost items with optional images and private notes.
- **Smart Suggestions**: Get location suggestions based on historical data when reporting lost items.
- **My Items**: Manage your reported lost items.
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop.

## Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, Zustand, React Hook Form, Zod, Sonner.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer.
- **Storage**: Local image storage.

## Project Structure

- `backend/`: Node.js/Express API
- `frontend/`: Next.js Frontend