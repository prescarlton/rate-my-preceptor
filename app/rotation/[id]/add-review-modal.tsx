"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import rateRotation from "../../actions/rate-rotation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddRotationReviewModalProps {
  rotationId: string;
}

export default function AddRotationReviewModal({ rotationId }: AddRotationReviewModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const note = formData.get("note") as string;

    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a rating (1-5 stars)");
      return;
    }

    if (!note.trim()) {
      setError("Please provide a review note");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await rateRotation({
        rotationId,
        rating,
        note: note.trim(),
      });

      if (success) {
        setOpen(false);
        setRating(0);
        setHoveredRating(0);
        e.currentTarget.reset();
        router.refresh();
      } else {
        setError("Failed to add review. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const StarInput = ({ value }: { value: number }) => {
    const isFilled = value <= (hoveredRating || rating);
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setRating(value)}
        onMouseEnter={() => setHoveredRating(value)}
        onMouseLeave={() => setHoveredRating(0)}
        className={`text-2xl transition-colors p-0 h-auto ${
          isFilled ? "text-yellow-400" : "text-zinc-300 dark:text-zinc-700"
        } hover:text-yellow-400`}
        disabled={isSubmitting}
      >
        ★
      </Button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isSubmitting) {
        setOpen(newOpen);
      }
    }}>
      <DialogTrigger asChild>
        <Button size="sm">+ Add Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Review</DialogTitle>
          <DialogDescription>
            Share your experience with this rotation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>
              Rating *
            </Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <StarInput key={value} value={value} />
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {rating} star{rating !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">
              Review Notes *
            </Label>
            <Textarea
              id="note"
              name="note"
              required
              disabled={isSubmitting}
              rows={4}
              placeholder="Share your experience with this rotation..."
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

