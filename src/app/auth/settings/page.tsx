"use client";
import { supabase } from "@/src/lib/supabaseClient";
import Button from "@/src/components/button";
import { useState, useEffect } from "react";
import { Pen } from "lucide-react";
import { FetchInitials } from "@/src/utils/fetchInitials";
import { useRef } from "react";
import Image from "next/image";

export default function UpdateUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [defaultFirstName, setDefaultFirstName] = useState("");
  const [defaultLastName, setDefaultLastName] = useState("");

  const [updatedFirstName, setUpdatedFirstName] = useState(false);
  const [updatedLastName, setUpdatedLastName] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [initials, setInitials] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfileDate() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(userError?.message || "User not found.");
        return;
      }

      setUserId(user.id);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setError(profileError.message);
      } else if (profile) {
        setFirstName(profile.first_name);
        setDefaultFirstName(profile.first_name);
        setLastName(profile.last_name);
        setDefaultLastName(profile.last_name);
        setAvatarUrl(profile.avatar_url ?? null);
      }

      const result = await FetchInitials();
      setInitials(result);
    }

    fetchProfileDate();
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  }

  async function updateUserData(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const file = fileInputRef.current?.files?.[0];

    let uploadedAvatarUrl = avatarUrl;
    if (avatarFile) {
      const fileExt = file?.name.split(".").pop();
      const fileName = `${userId}/avatar.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file!, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload failed:", uploadError.message);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        uploadedAvatarUrl = publicUrlData.publicUrl;
        setAvatarUrl(uploadedAvatarUrl);
      }
    }

    if (password.length > 0) {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        avatar_url: uploadedAvatarUrl,
      })
      .eq("id", userId);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    setMessage("Details updated.");
    setPassword("");
    setAvatarFile(null);
  }

  return (
    <main className="h-[100vh] min-h-[700px] flex flex-col items-center justify-center p-6">
      <h1 className="pb-8 text-center">Update Account Details</h1>
      <form className="auth-form" onSubmit={updateUserData}>
        <div className="w-24 h-24 relative m-auto">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              width={96}
              height={96}
              alt="User avatar"
              className="rounded-full w-full h-full object-cover mb-1"
            />
          ) : (
            <div className="rounded-full size-full object-cover bg-[var(--primary-color)] text-[var(--text)] flex justify-center items-center pt-1 mb-1 text-2xl">
              {initials}
            </div>
          )}
          <div className="absolute right-0 bottom-0 bg-[var(--secondary-background)] w-8 h-8 flex justify-center items-center rounded-full border-1 border-[var(--primary-color)]">
            <label htmlFor="avatar-upload">
              <Pen size={14} strokeWidth={1} />
            </label>
          </div>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div>
          <label htmlFor="firstName">First Name</label>
          <div className="relative inline-block">
            <input
              className={`editInput pr-8 ${
                updatedFirstName ? "input-filled" : "input-default"
              }`}
              id="fName"
              type="text"
              value={firstName}
              placeholder={firstName}
              onChange={e => {
                setFirstName(e.target.value);
                setUpdatedFirstName(e.target.value !== defaultFirstName);
              }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--unavailable-text)]">
              <Pen size={16} strokeWidth={1} />
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <div className="relative inline-block">
            <input
              className={`editInput pr-8 ${
                updatedLastName ? "input-filled" : "input-default"
              }`}
              id="lName"
              type="text"
              value={lastName}
              onChange={e => {
                setLastName(e.target.value);
                setUpdatedLastName(e.target.value !== defaultLastName);
              }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--unavailable-text)]">
              <Pen size={16} strokeWidth={1} />
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <div className="relative inline-block">
            <input
              placeholder="********"
              autoComplete="new-password"
              className={`editInput pr-8 ${
                password ? "input-filled" : "input-default"
              }`}
              id="password"
              type="password"
              onChange={e => setPassword(e.target.value)}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--unavailable-text)]">
              <Pen size={16} strokeWidth={1} />
            </span>
          </div>
          {error && <div className="text-[var(--danger)]">{error}</div>}
          {message && <div>{message}</div>}
        </div>
        {updatedFirstName || updatedLastName || password || avatarFile ? (
          <Button type="submit" variant="primary">
            Update details
          </Button>
        ) : (
          <Button type="submit" variant="disabled">
            Update details
          </Button>
        )}
      </form>
    </main>
  );
}
