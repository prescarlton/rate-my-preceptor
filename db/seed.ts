import { db } from "./index";
import { preceptors, preceptorReviews } from "./schema";
import { nanoid } from "nanoid";

// Simple nanoid replacement if not installed
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function seed() {
  // Clear existing data
  db.delete(preceptorReviews).run();
  db.delete(preceptors).run();

  // Insert sample preceptors
  const preceptor1 = {
    id: generateId(),
    name: "Dr. Sarah Johnson",
    specialty: "Emergency Medicine",
    location: "New York Presbyterian Hospital",
    averageRating: 4.5,
    totalReviews: 3,
  };

  const preceptor2 = {
    id: generateId(),
    name: "Dr. Michael Chen",
    specialty: "Family Medicine",
    location: "Mount Sinai Hospital",
    averageRating: 4.8,
    totalReviews: 5,
  };

  const preceptor3 = {
    id: generateId(),
    name: "Dr. Emily Rodriguez",
    specialty: "Internal Medicine",
    location: "Johns Hopkins Hospital",
    averageRating: 4.2,
    totalReviews: 4,
  };

  db.insert(preceptors).values(preceptor1).run();
  db.insert(preceptors).values(preceptor2).run();
  db.insert(preceptors).values(preceptor3).run();

  // Insert sample reviews
  const reviewsData = [
    {
      id: generateId(),
      preceptorId: preceptor1.id,
      rating: 5,
      note: "Excellent preceptor! Very supportive and great at teaching. Made the rotation enjoyable and educational.",
    },
    {
      id: generateId(),
      preceptorId: preceptor1.id,
      rating: 4,
      note: "Good experience overall. Knowledgeable and patient with students. Sometimes hard to reach for questions.",
    },
    {
      id: generateId(),
      preceptorId: preceptor1.id,
      rating: 4,
      note: "Solid rotation. Preceptor was professional and provided good feedback. Would recommend.",
    },
    {
      id: generateId(),
      preceptorId: preceptor2.id,
      rating: 5,
      note: "Outstanding preceptor! Very approachable and excellent at explaining complex concepts. Best rotation experience.",
    },
    {
      id: generateId(),
      preceptorId: preceptor2.id,
      rating: 5,
      note: "Amazing teacher and mentor. Always available for questions and provides constructive feedback.",
    },
    {
      id: generateId(),
      preceptorId: preceptor2.id,
      rating: 4,
      note: "Great preceptor with lots of experience. Very knowledgeable in family medicine.",
    },
    {
      id: generateId(),
      preceptorId: preceptor2.id,
      rating: 5,
      note: "One of the best preceptors I've had. Very supportive and creates a great learning environment.",
    },
    {
      id: generateId(),
      preceptorId: preceptor2.id,
      rating: 5,
      note: "Excellent clinical skills and teaching ability. Highly recommend this rotation.",
    },
    {
      id: generateId(),
      preceptorId: preceptor3.id,
      rating: 4,
      note: "Good preceptor, very thorough in patient care. Sometimes a bit rushed but always helpful.",
    },
    {
      id: generateId(),
      preceptorId: preceptor3.id,
      rating: 4,
      note: "Professional and knowledgeable. Good learning experience overall.",
    },
    {
      id: generateId(),
      preceptorId: preceptor3.id,
      rating: 5,
      note: "Great preceptor! Very organized and provides excellent guidance for students.",
    },
    {
      id: generateId(),
      preceptorId: preceptor3.id,
      rating: 4,
      note: "Solid teaching and good patient interaction examples. Would recommend.",
    },
  ];

  for (const review of reviewsData) {
    db.insert(preceptorReviews).values(review).run();
  }

  console.log("Database seeded successfully!");
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed();
}

