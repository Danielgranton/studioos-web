"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleUserRound, Image as ImageIcon, LockKeyhole, Mail, Phone, ShieldCheck, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AuthService, clearSession, useSession } from "@/features/auth";
import { EmailChangeForm } from "./emailChangeForm";
import { PhoneChangeForm } from "./phoneChangeForm";
import { ChangePasswordForm } from "./changePasswordForm";
import { RoleManagement } from "./roleManagement";
import { AccountService } from "../services/account.service";
import { useAccountProfile } from "../hooks/useAccountProfile";
import type { AccountProfile, UpdateProfileRequest } from "../types/account";
import { getApiErrorMessage } from "@/lib/api/errorMessage";

export function ProfileSettings() {
    const { session, isLoading: sessionLoading } = useSession();
    const { profile, setProfile, loading, refresh } = useAccountProfile();
    const [editingProfile, setEditingProfile] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [editingUsername, setEditingUsername] = useState(false);
    const [savingUsername, setSavingUsername] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const user = profile || (session ? { id: session.userId, name: session.name, email: session.email, phone: session.phone, role: session.role } : null);

    async function handleLogout() {
        try { await AuthService.logout(); } catch { /* Local cleanup still prevents stale client state. */ } finally {
            clearSession();
            window.location.assign("/auth/signin");
        }
    }

    async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const payload: UpdateProfileRequest = {
            bio: readValue(form, "bio"), location: readValue(form, "location"), genre: readValue(form, "genre"),
            experience: readValue(form, "experience"), instagram: readValue(form, "instagram"), youtube: readValue(form, "youtube"), link: readValue(form, "link"),
        };
        setSavingProfile(true);
        try { setProfile(await AccountService.updateProfile(payload)); setEditingProfile(false); toast.success("Profile updated"); }
        catch (error) { const response = (error as { response?: { data?: { message?: string } } }).response; toast.error("Could not update profile", { description: response?.data?.message || "Please try again." }); }
        finally { setSavingProfile(false); }
    }

    async function saveUsername(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const username = readValue(new FormData(event.currentTarget), "username");
        if (!username) { toast.error("Enter a username"); return; }
        setSavingUsername(true);
        try { setProfile(await AccountService.updateUsername({ username })); setEditingUsername(false); toast.success("Username updated"); }
        catch (error) { const response = (error as { response?: { data?: { message?: string } } }).response; toast.error("Could not update username", { description: response?.data?.message || "Please try again." }); }
        finally { setSavingUsername(false); }
    }

    async function uploadProfileImage(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]; event.target.value = "";
        if (!file) return;
        if (!file.type.startsWith("image/")) { toast.error("Choose an image file"); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error("Profile image must not exceed 5 MB"); return; }
        setUploadingImage(true);
        try { setProfile(await AccountService.updateProfileImage(file)); toast.success("Profile image updated"); }
        catch (error) { toast.error("Could not update profile image", { description: getApiErrorMessage(error, "The image could not be uploaded. Please try again.") }); }
        finally { setUploadingImage(false); }
    }

    if (sessionLoading || loading) return <div className="mx-auto max-w-6xl py-16 text-sm text-[#888]">Loading profile...</div>;

    return <div className="mx-auto max-w-6xl px-4 py-8 text-[#f1f1f1] sm:px-10 sm:py-12 md:px-15 lg:px-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3ea6ff]">Account</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Your profile</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#888]">Manage the identity and creative details shown across StudioOS.</p></div>
            <Link href="/dashboard/settings" className="inline-flex items-center gap-2 self-start rounded-xl border border-[#3f3f3f] px-4 py-2.5 text-sm text-[#ddd] transition hover:border-[#3ea6ff]/50 hover:bg-[#222] sm:self-auto">Account settings <ArrowRight size={15} /></Link>
        </div>
        <section className="rounded-2xl border border-[#3f3f3f] bg-[#151515] p-5 sm:p-6">
            <SectionHeading icon={<CircleUserRound size={18} />} title="Profile details" description="Your public identity and creator information." />
            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#272727] text-[#777]">{profile?.profileImageMedium || profile?.profileImage ? <Image unoptimized src={(profile.profileImageMedium || profile.profileImage) as string} alt={user?.name || "Profile"} fill className="object-cover" /> : <ImageIcon size={22} />}</div><div><p className="text-lg font-semibold">{user?.name || "StudioOS user"}</p><p className="mt-1 text-sm capitalize text-[#888]">{user?.role?.replaceAll("_", " ") || "User"}</p></div></div><div className="flex flex-wrap gap-2"><input id="profile-image" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={uploadProfileImage} /><label htmlFor="profile-image" className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#3f3f3f] px-4 py-2 text-sm text-[#ddd] transition hover:border-[#3ea6ff]/50 hover:bg-[#222]">{uploadingImage ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#555] border-t-[#3ea6ff]" /> : <Upload size={15} />}{uploadingImage ? "Uploading..." : "Change photo"}</label><button type="button" onClick={() => setEditingProfile((current) => !current)} className="rounded-xl border border-[#3f3f3f] px-4 py-2 text-sm text-[#ddd] transition hover:border-[#3ea6ff]/50 hover:bg-[#222]">{editingProfile ? "Cancel" : "Edit profile"}</button></div></div>
            {editingProfile ? <ProfileForm profile={profile} saving={savingProfile} onSubmit={saveProfile} /> : <div className="mt-6 grid gap-3 sm:grid-cols-2"><InfoItem icon={<Mail size={16} />} label="Email" value={user?.email || "Not available"} /><InfoItem icon={<Phone size={16} />} label="Phone" value={user?.phone || "Not added"} /><InfoItem icon={<CircleUserRound size={16} />} label="Location" value={profile?.location || "Not added"} /><InfoItem icon={<ShieldCheck size={16} />} label="Genre" value={profile?.genre || "Not added"} /></div>}
            {user?.email && <EmailChangeForm currentEmail={user.email} onChanged={() => { void refresh(); }} />}<PhoneChangeForm currentPhone={user?.phone} onChanged={() => { void refresh(); }} />
            <div className="mt-3 rounded-xl border border-[#303030] bg-[#101010] px-4 py-3">{editingUsername ? <form onSubmit={saveUsername} className="flex flex-col gap-3 sm:flex-row sm:items-end"><Field label="Username" name="username" defaultValue={profile?.username} placeholder="your_username" /><div className="flex gap-2 sm:shrink-0"><button type="button" onClick={() => setEditingUsername(false)} className="rounded-lg border border-[#3f3f3f] px-3 py-2 text-xs text-[#aaa]">Cancel</button><button type="submit" disabled={savingUsername} className="rounded-lg bg-[#3ea6ff] px-3 py-2 text-xs font-semibold text-[#0f0f0f] disabled:opacity-60">{savingUsername ? "Saving..." : "Save"}</button></div></form> : <div className="flex items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.16em] text-[#666]">Username</p><p className="mt-1 text-sm text-[#ddd]">{profile?.username ? `@${profile.username}` : "Not set"}</p></div><button type="button" onClick={() => setEditingUsername(true)} className="text-xs font-medium text-[#3ea6ff] hover:text-[#65b8ff]">{profile?.username ? "Change" : "Add username"}</button></div>}</div>
        </section>
        <section className="mt-5 rounded-2xl border border-[#3f3f3f] bg-[#151515] p-5 sm:p-6">
            <SectionHeading icon={<LockKeyhole size={18} />} title="Security and role" description="Update your password and manage your account role." />
            <ChangePasswordForm />
            {user?.role && <RoleManagement currentRole={user.role} />}
        </section>
        <div className="mt-5 flex justify-end"><button type="button" onClick={() => void handleLogout()} className="rounded-xl px-3 py-2 text-sm text-red-300 transition hover:bg-red-400/10">Log out</button></div>
    </div>;
}

function SectionHeading({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) { return <div className="flex items-start gap-3"><span className="mt-0.5 text-[#3ea6ff]">{icon}</span><div><h2 className="text-base font-semibold">{title}</h2><p className="mt-1 text-sm text-[#888]">{description}</p></div></div>; }
function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-xl border border-[#303030] bg-[#101010] px-4 py-3"><div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#666]">{icon}{label}</div><p className="mt-2 truncate text-sm text-[#ddd]">{value}</p></div>; }
function ProfileForm({ profile, saving, onSubmit }: { profile: AccountProfile | null; saving: boolean; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) { return <form onSubmit={onSubmit} className="mt-6 space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Location" name="location" defaultValue={profile?.location} placeholder="Nairobi, Kenya" /><Field label="Genre" name="genre" defaultValue={profile?.genre} placeholder="Afrobeats, hip-hop..." /></div><Field label="Bio" name="bio" defaultValue={profile?.bio} placeholder="Tell the StudioOS community about yourself" multiline /><Field label="Experience" name="experience" defaultValue={profile?.experience} placeholder="Your creative experience" multiline /><div className="grid gap-4 sm:grid-cols-3"><Field label="Instagram" name="instagram" defaultValue={profile?.instagram} placeholder="@username" /><Field label="YouTube" name="youtube" defaultValue={profile?.youtube} placeholder="Channel URL" /><Field label="Website" name="link" defaultValue={profile?.link} placeholder="https://..." /></div><div className="flex justify-end"><button type="submit" disabled={saving} className="rounded-xl bg-[#3ea6ff] px-5 py-2.5 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff] disabled:opacity-60">{saving ? "Saving..." : "Save changes"}</button></div></form>; }
function Field({ label, name, defaultValue, placeholder, multiline = false }: { label: string; name: string; defaultValue?: string; placeholder: string; multiline?: boolean }) { const className = "mt-1.5 w-full rounded-xl border border-[#3f3f3f] bg-[#101010] px-3.5 py-2.5 text-sm text-[#f1f1f1] outline-none placeholder:text-[#666] focus:border-[#3ea6ff]/70"; return <label className="block text-xs font-medium text-[#aaa]">{label}{multiline ? <textarea name={name} defaultValue={defaultValue} placeholder={placeholder} rows={3} className={className} /> : <input name={name} defaultValue={defaultValue} placeholder={placeholder} className={className} />}</label>; }
function readValue(form: FormData, name: string) { const field = form.get(name); return typeof field === "string" && field.trim() ? field.trim() : undefined; }
