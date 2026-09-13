"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileImage,
  Home,
  LayoutDashboard,
  MapPin,
  Users,
  X,
} from "lucide-react";
import Navbar from "../../../components/navbar";

const MAX_IMAGES = 5;

export default function CreateVenuePage() {
  const [name, setName] = useState("");
  const [building, setBuilding] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (files: FileList | null) => {
    const nextImages = Array.from(files || []);

    if (nextImages.length > MAX_IMAGES) {
      setError(`You can select a maximum of ${MAX_IMAGES} images.`);
      setSelectedImages(nextImages.slice(0, MAX_IMAGES));
      return;
    }

    setError("");
    setSelectedImages(nextImages);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData();

    formData.append("name", name);
    formData.append("building", building);
    formData.append("capacity", String(capacity));

    for (const image of selectedImages) {
      formData.append("images", image);
    }

    try {
      const response = await fetch("/api/Create-venue", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create venue");
      }

      // Clear form after successful creation
      setMessage("Venue created successfully.");
      setName("");
      setBuilding("");
      setCapacity("");
      setSelectedImages([]);

      // Clear actual file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 sm:px-6 lg:px-8">
      <Navbar />
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-black/50 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">

          {/* Left information section */}
          <section className="flex flex-col justify-between rounded-3xl bg-black p-7 text-white sm:p-9 lg:min-h-[650px]">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                <Building2 size={23} />
              </div>

              <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Campus Resource Management
              </p>

              <h1 className="mt-4 max-w-md text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                Create a new
                <br />
                campus venue.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-6 text-white/55">
                Add a venue to the campus resource system so students
                and administrators can discover and use it for events
                and activities.
              </p>
            </div>

            <div className="mt-12 space-y-3">
              <InfoItem
                icon={<Building2 size={17} />}
                text="Add venue details"
              />
              <InfoItem
                icon={<Users size={17} />}
                text="Define venue capacity"
              />
              <InfoItem
                icon={<FileImage size={17} />}
                text="Upload venue images"
              />
            </div>
          </section>

          {/* Form */}
          <section className="rounded-3xl border border-slate-300 bg-white p-6 text-[#101622] shadow-lg shadow-black/5 sm:p-9">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                Venue details
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Create Venue
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Enter the information below to create a new venue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Venue name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#101622]">
                  Venue name
                </label>

                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    type="text"
                    placeholder="e.g. Seminar Hall A"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm text-[#101622] outline-none transition placeholder:text-slate-500 focus:border-[#101622] focus:ring-2 focus:ring-[#E8B928]/50"
                  />
                </div>
              </div>

              {/* Building */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#101622]">
                  Building
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    type="text"
                    placeholder="e.g. Main Academic Block"
                    value={building}
                    onChange={(event) => setBuilding(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm text-[#101622] outline-none transition placeholder:text-slate-500 focus:border-[#101622] focus:ring-2 focus:ring-[#E8B928]/50"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#101622]">
                  Capacity
                </label>

                <div className="relative">
                  <Users
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 120"
                    value={capacity}
                    onChange={(event) => setCapacity(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm text-[#101622] outline-none transition placeholder:text-slate-500 focus:border-[#101622] focus:ring-2 focus:ring-[#E8B928]/50"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  {capacity ? `This venue can host up to ${capacity} people.` : "Enter the maximum number of people this venue can hold."}
                </p>
              </div>

              {/* Images */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#101622]">
                  Venue images
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-[#101622] hover:bg-white">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#101622] text-[#E8B928]">
                    <FileImage size={21} />
                  </div>

                  <p className="mt-3 text-sm font-medium">
                    Choose venue images
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Select one or more JPG, PNG, or WEBP images
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => handleImageChange(event.target.files)}
                    className="hidden"
                  />
                </label>

                {selectedImages.length > 0 && (
                  <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-[#101622]">
                      {selectedImages.length} image
                      {selectedImages.length > 1 ? "s" : ""} selected
                    </p>
                    {selectedImages.map((image, index) => (
                      <div key={`${image.name}-${image.lastModified}`} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-xs text-slate-700">
                        <span className="min-w-0 truncate">{image.name}</span>
                        <button
                          type="button"
                          aria-label={`Remove ${image.name}`}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setSelectedImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Success */}
              {message && (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Venue created successfully
                      </p>

                      <p className="mt-1 text-xs text-green-700">
                        The venue has been added to the campus resource
                        system.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#101622] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#263246] focus:outline-none focus:ring-2 focus:ring-[#E8B928] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Venue"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            {/* Navigation */}
            <div className="mt-8 border-t border-black/10 pt-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-black/35">
                Continue to
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-3 text-xs font-medium transition hover:bg-black/5"
                >
                  <Home size={15} />
                  Home
                </Link>

                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-3 text-xs font-medium transition hover:bg-black/5"
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>

                <Link
                  href="/venue"
                  className="flex items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-3 text-xs font-medium transition hover:bg-black/5"
                >
                  <Building2 size={15} />
                  See Venues
                </Link>

              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function InfoItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-white/60">{icon}</div>
      <span className="text-sm text-white/65">{text}</span>
    </div>
  );
}