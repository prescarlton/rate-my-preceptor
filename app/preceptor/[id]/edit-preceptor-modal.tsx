"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import updatePreceptor from "../../actions/update-preceptor";
import getRotations from "../../actions/get-rotations";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditPreceptorModalProps {
  preceptor: {
    id: string;
    name: string;
    specialty: string | null;
    rotation: {
      id: string;
      name: string;
      location: string;
    };
  };
}

export default function EditPreceptorModal({
  preceptor,
}: EditPreceptorModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rotations, setRotations] = useState<
    Array<{ id: string; name: string; location: string }>
  >([]);
  const [useExistingRotation, setUseExistingRotation] = useState(true);
  const [selectedRotationId, setSelectedRotationId] = useState(
    preceptor.rotation.id,
  );
  const router = useRouter();

  useEffect(() => {
    if (open) {
      getRotations().then(setRotations).catch(console.error);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const specialty = formData.get("specialty") as string;

    let rotationName = "";
    let rotationLocation = "";

    if (useExistingRotation) {
      const selectedRotation = rotations.find(
        (r) => r.id === selectedRotationId,
      );
      if (!selectedRotation) {
        setError("Please select a rotation");
        setIsSubmitting(false);
        return;
      }
      rotationName = selectedRotation.name;
      rotationLocation = selectedRotation.location;
    } else {
      rotationName = formData.get("rotationName") as string;
      rotationLocation = formData.get("rotationLocation") as string;
    }

    if (
      !name.trim() ||
      !specialty.trim() ||
      !rotationName.trim() ||
      !rotationLocation.trim()
    ) {
      setError("All fields are required");
      setIsSubmitting(false);
      return;
    }

    try {
      const preceptorId = await updatePreceptor({
        id: preceptor.id,
        name: name.trim(),
        specialty: specialty.trim(),
        rotationName: rotationName.trim(),
        rotationLocation: rotationLocation.trim(),
      });

      if (preceptorId) {
        setOpen(false);
        router.refresh();
      } else {
        setError("Failed to update preceptor. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!isSubmitting) {
          setOpen(newOpen);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Preceptor</DialogTitle>
          <DialogDescription>Update preceptor information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              type="text"
              id="name"
              name="name"
              required
              disabled={isSubmitting}
              defaultValue={preceptor.name}
              placeholder="Dr. John Smith"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty *</Label>
            <Input
              type="text"
              id="specialty"
              name="specialty"
              required
              disabled={isSubmitting}
              defaultValue={preceptor.specialty || ""}
              placeholder="Emergency Medicine"
            />
          </div>

          <div className="space-y-2">
            <Label>Rotation (Where they work) *</Label>
            <div className="mb-3 flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={useExistingRotation}
                  onChange={() => setUseExistingRotation(true)}
                  disabled={isSubmitting}
                  className="text-blue-600"
                />
                <span className="text-sm">Use existing</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!useExistingRotation}
                  onChange={() => setUseExistingRotation(false)}
                  disabled={isSubmitting}
                  className="text-blue-600"
                />
                <span className="text-sm">Create new</span>
              </label>
            </div>

            {useExistingRotation ? (
              <Select
                value={selectedRotationId}
                onValueChange={setSelectedRotationId}
                required
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a rotation..." />
                </SelectTrigger>
                <SelectContent>
                  {rotations.map((rotation) => (
                    <SelectItem key={rotation.id} value={rotation.id}>
                      {rotation.name} - {rotation.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-3">
                <Input
                  type="text"
                  id="rotationName"
                  name="rotationName"
                  required={!useExistingRotation}
                  disabled={isSubmitting}
                  defaultValue={preceptor.rotation.name}
                  placeholder="Rotation Name (e.g., Emergency Medicine)"
                />
                <Input
                  type="text"
                  id="rotationLocation"
                  name="rotationLocation"
                  required={!useExistingRotation}
                  disabled={isSubmitting}
                  defaultValue={preceptor.rotation.location}
                  placeholder="Location (e.g., New York Presbyterian Hospital)"
                />
              </div>
            )}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Preceptor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
