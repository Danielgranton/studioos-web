"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { BadgeCheck, Building2, Check, Film, Heart, ImagePlus, Loader2, MapPin, Pencil, Plus, Sparkles, Star, Trash2 } from "lucide-react";

import { DashboardErrorState, useDashboardSession } from "@/features/dashboard";
import { VerificationGuide } from "@/features/verification";
import { ServiceCatalogService } from "@/features/services";
import type { ServiceCatalogItem } from "@/features/services";

import { useMyStudios } from "../hooks/useMyStudios";
import type { Studio, StudioFormValues, StudioMedia, StudioServiceOffering } from "../types/studio";
import { StudioService } from "../services/studio.service";

const EMPTY_FORM: StudioFormValues = {
    studioName: "",
    location: "",
    pricing: "0",
    productionPackagePrice: "",
    availability: "",
    description: "",
    services: "",
    serviceDetails: ["Beat creation", "Recording", "Mixing", "Mastering"].map((name) => ({ name, active: true, includedInProductionPackage: true, price: null })),
    badge: "",
    genres: "",
    equipment: "",
    rooms: "",
    yearsActive: "",
    responseTime: "",
    available: true,
    nextAvailable: "",
};

export function MyStudioPage() {
    const session = useDashboardSession();
    const router = useRouter();
    const { studios, loading, saving, error, refresh, create, update, uploadImage } = useMyStudios();
    const [editing, setEditing] = useState<Studio | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [packageOnly, setPackageOnly] = useState(false);

    useEffect(() => {
        if (session && session.role !== "PRODUCER") router.replace("/dashboard");
    }, [router, session]);

    if (session?.role !== "PRODUCER") return null;

    function openCreate() {
        setEditing(null);
        setPackageOnly(false);
        setShowForm(true);
    }

    function openEdit(studio: Studio) {
        setEditing(studio);
        setPackageOnly(false);
        setShowForm(true);
    }

    function openPackageEdit(studio: Studio) {
        setEditing(studio);
        setPackageOnly(true);
        setShowForm(true);
    }

    async function save(values: StudioFormValues) {
        const { profileImage, ...details } = values;
        const packagePrice = Number(details.productionPackagePrice);
        if (!Number.isInteger(packagePrice) || packagePrice < 1) {
            toast.error("Set your full-production package price", { description: "Enter the total price for the enabled package stages." });
            return;
        }
        if (!details.serviceDetails.some((item) => item.active)) {
            toast.error("Keep at least one stage in the package", { description: "You can disable stages you do not offer, but the package needs one included stage." });
            return;
        }
        if (profileImage && !isSupportedImage(profileImage)) {
            toast.error("Unsupported studio image", { description: "Use a JPEG, PNG, or WebP image smaller than 5 MB." });
            return;
        }
        const payload = {
            studioName: details.studioName.trim(),
            location: details.location.trim(),
            pricing: packagePrice,
            productionPackagePrice: packagePrice,
            availability: details.availability.trim(),
            description: details.description.trim(),
            services: details.serviceDetails.filter((item) => item.active).map((item) => item.name),
            serviceDetails: details.serviceDetails.map((item) => ({
                name: item.name,
                catalogServiceId: item.catalogServiceId,
                active: item.active,
                includedInProductionPackage: true,
                price: null,
            })),
            badge: details.badge.trim() || undefined,
            genres: details.genres.split(",").map((item) => item.trim()).filter(Boolean),
            equipment: details.equipment.split(",").map((item) => item.trim()).filter(Boolean),
            rooms: details.rooms ? Number(details.rooms) : undefined,
            yearsActive: details.yearsActive ? Number(details.yearsActive) : undefined,
            responseTime: details.responseTime.trim() || undefined,
            available: details.available,
            nextAvailable: details.nextAvailable.trim() || undefined,
        };

        let createdStudio = false;
        try {
            if (editing) {
                const updatedStudio = await update(editing.id, payload);
                if (profileImage) await uploadImage(updatedStudio.id, profileImage);
                toast.success("Studio listing updated");
            } else {
                const studio = await create(payload);
                createdStudio = true;
                if (profileImage) await uploadImage(studio.id, profileImage);
                toast.success("Studio listing created");
            }
            setShowForm(false);
            setEditing(null);
        } catch {
            toast.error(createdStudio ? "Studio registered, but image upload failed" : editing ? "Could not save studio listing" : "Could not register studio", {
                description: createdStudio ? "Your listing was created. You can upload the image from the studio card." : "Check your details and try again.",
            });
        }
    }

    return (
        <div className="mx-auto w-full max-w-5xl p-5 sm:p-8 lg:p-10">
            <header className="flex flex-col gap-5 border-b border-[#2b2b2b] pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#3ea6ff]">Producer workspace</p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#f1f1f1] sm:text-3xl">My studio</h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#888]">Create a clear, bookable listing for artists looking for their next recording space.</p>
                </div>
                {!showForm && <button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3ea6ff] px-4 py-2.5 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ea6ff]"> <Plus size={16} /> Add studio</button>}
            </header>

            {!showForm && studios.length > 0 && <StudioSummary studios={studios} />}

            {showForm ? (
                packageOnly && editing ? <StudioPackageForm studio={editing} saving={saving} onCancel={() => { setShowForm(false); setEditing(null); setPackageOnly(false); }} onSubmit={async (productionPackagePrice, serviceDetails) => {
                    await update(editing.id, {
                        pricing: productionPackagePrice,
                        productionPackagePrice,
                        services: serviceDetails.filter((item) => item.active).map((item) => item.name),
                        serviceDetails: serviceDetails.map((item) => ({ ...item, includedInProductionPackage: true, price: null })),
                    });
                    toast.success("Production package updated");
                    setShowForm(false);
                    setEditing(null);
                    setPackageOnly(false);
                }} /> : <StudioForm initialValues={editing ? toFormValues(editing) : EMPTY_FORM} editing={Boolean(editing)} saving={saving} onCancel={() => { setShowForm(false); setEditing(null); }} onSubmit={save} />
            ) : loading ? (
                <div className="mt-8 rounded-2xl border border-[#2b2b2b] bg-[#151515] p-8 text-sm text-[#888]">Loading your studio listings...</div>
            ) : error ? (
                <DashboardErrorState title="Studio listings unavailable" description="We could not reach your studio workspace. Your listings are safe; reconnect and try again." onRetry={refresh} />
            ) : studios.length === 0 ? (
                <EmptyStudioState onCreate={openCreate} />
            ) : (
                <StudioManagementList studios={studios} onEdit={openEdit} onEditPackage={openPackageEdit} onRefresh={refresh} />
            )}
        </div>
    );
}

function isSupportedImage(file: File) {
    return file.size <= 5 * 1024 * 1024
        && ["image/jpeg", "image/png", "image/webp"].includes(file.type);
}

function StudioManagementList({ studios, onEdit, onEditPackage, onRefresh }: { studios: Studio[]; onEdit: (studio: Studio) => void; onEditPackage: (studio: Studio) => void; onRefresh: () => Promise<void> }) {
    return <section className="mt-8 space-y-8" aria-label="Studio listings">{studios.map((studio) => <StudioManagementRow key={studio.id} studio={studio} onEdit={() => onEdit(studio)} onEditPackage={() => onEditPackage(studio)} onRefresh={onRefresh} />)}</section>;
}

function StudioManagementRow({ studio, onEdit, onEditPackage, onRefresh }: { studio: Studio; onEdit: () => void; onEditPackage: () => void; onRefresh: () => Promise<void> }) {
    const gallery = getStudioGallery(studio);

    return <article className="overflow-hidden rounded-[26px] border border-[#2b2b2b] bg-[#151515] shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
        <StudioGallery studio={studio} gallery={gallery} />
        <div className="relative -mt-24 bg-gradient-to-t from-[#151515] via-[#151515]/95 to-transparent px-5 pb-5 pt-20 sm:px-7 sm:pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2"><h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{studio.studioName}</h2>{studio.verified && <BadgeCheck size={18} className="text-[#5eead4]" />}</div><div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#b1b1b1]"><span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-[#3ea6ff]" />{studio.location}</span><span className="rounded-full border border-[#454545] bg-[#242424]/80 px-2.5 py-1 text-xs text-[#d0d0d0]">{studio.badge || "Standard listing"}</span></div></div><div className="flex items-center gap-2"><span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${studio.available ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-orange-400/20 bg-orange-400/10 text-orange-300"}`}><span className={`h-1.5 w-1.5 rounded-full ${studio.available ? "bg-emerald-400" : "bg-orange-400"}`} />{studio.available ? "Available" : "Busy"}</span><button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded-xl border border-[#454545] bg-[#242424] px-3 py-2 text-xs font-semibold text-[#eee] transition hover:border-[#3ea6ff]/60"><Pencil size={14} /> Edit listing</button></div></div>
        </div>
        <VerificationGuide subject="studio" status={studio.verificationStatus ?? (studio.verified ? "VERIFIED" : "UNVERIFIED")} items={[{ label: "Add a clear studio profile image", complete: Boolean(studio.profileImage || studio.profileImageMedium || studio.profileImageThumbnail) }, { label: "Write a detailed listing description", complete: Boolean(studio.description?.trim()) }, { label: "Set your location and package price", complete: Boolean(studio.location?.trim() && studio.productionPackagePrice && studio.productionPackagePrice > 0) }, { label: "List your services and genres", complete: studio.services.length > 0 && studio.genres.length > 0 }, { label: "Add gallery photos of the space", complete: (studio.media?.filter((item) => item.type === "IMAGE").length || 0) > 0 }]} />
        <StudioMediaManager studio={studio} onRefresh={onRefresh} />
            <div className="grid gap-6 border-t border-[#2b2b2b] px-5 py-6 sm:px-7 lg:grid-cols-[1.2fr_1fr]">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#666]">Listing overview</p><p className="mt-3 max-w-2xl text-sm leading-7 text-[#999]">{studio.description || "Add a description to help artists understand the space and its capabilities."}</p><StudioServicesOverview studio={studio} onEdit={onEditPackage} /></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2"><Metric label="Package price" value={studio.productionPackagePrice ? `KSh ${studio.productionPackagePrice.toLocaleString()}` : "Set package price"} /><Metric label="Next available" value={studio.nextAvailable || studio.availability} /><Metric label="Rating" value={studio.averageRating ? studio.averageRating.toFixed(1) : "New"} icon={<Star size={13} className="fill-[#e8a33d] text-[#e8a33d]" />} /><Metric label="Reviews" value={String(studio.totalRatings || 0)} /><Metric label="Likes" value={String(studio.likeCount || 0)} icon={<Heart size={13} className="text-red-300" />} /></div>
        </div>
    </article>;
}

function StudioServicesOverview({ studio, onEdit }: { studio: Studio; onEdit: () => void }) {
    const stages = ["Beat creation", "Recording", "Mixing", "Mastering"];
    const isStage = (name: string) => stages.some((stage) => stage.toLowerCase() === name.toLowerCase());
    const offerings = studio.serviceDetails || [];
    const extras = offerings.filter((item) => item.active && !isStage(item.name));

    function stageIsActive(name: string) {
        const detail = offerings.find((item) => isStage(item.name) && item.name.toLowerCase() === name.toLowerCase());
        return detail ? detail.active : studio.services.some((service) => service.toLowerCase() === name.toLowerCase());
    }

    return <section className="mt-6 rounded-2xl border border-[#2d2d2d] bg-[#101010] p-4 sm:p-5" aria-label="Studio services">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#777]">Full-production journey</p><p className="mt-1 text-xs text-[#999]">One package price for the stages you provide</p></div>{studio.productionPackagePrice != null && <span className="rounded-lg border border-[#3ea6ff]/20 bg-[#3ea6ff]/[0.07] px-2.5 py-1.5 text-xs font-semibold text-[#8acbff]">KSh {studio.productionPackagePrice.toLocaleString()}</span>}</div>
        <ol aria-label="Production stages" className="mt-4 grid gap-2 sm:grid-cols-2">{stages.map((name, index) => {
            const active = stageIsActive(name);
            return <li key={name} className={`flex min-w-0 items-center gap-3 rounded-xl border px-3 py-2.5 ${active ? "border-[#3ea6ff]/20 bg-[#3ea6ff]/[0.045]" : "border-[#292929] bg-[#151515] opacity-65"}`}><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg font-mono text-[10px] font-semibold ${active ? "bg-[#3ea6ff]/10 text-[#8acbff]" : "bg-[#202020] text-[#666]"}`}>0{index + 1}</span><span className={`min-w-0 flex-1 text-xs font-medium ${active ? "text-[#e5e5e5]" : "text-[#888]"}`}>{name}</span><span className={`text-[9px] font-semibold uppercase tracking-wide ${active ? "text-[#8acbff]" : "text-[#666]"}`}>{active ? "Included" : "Not offered"}</span></li>;
        })}</ol>
        {extras.length > 0 && <div className="mt-4 border-t border-[#292929] pt-3"><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#777]">Also included in package</p><ol className="mt-2 flex flex-wrap gap-2">{extras.map((item, index) => <li key={item.catalogServiceId || item.name} className="inline-flex items-center gap-2 rounded-lg border border-[#303030] bg-[#171717] px-2.5 py-1.5 text-[10px] text-[#bbb]"><span className="font-mono text-[#8acbff]">{String(index + 5).padStart(2, "0")}</span>{item.name}</li>)}</ol></div>}
        <button type="button" onClick={onEdit} className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8acbff] transition hover:text-white"><Pencil size={12} /> Edit services and package</button>
    </section>;
}

function StudioGallery({ studio, gallery }: { studio: Studio; gallery: StudioMedia[] }) {
    const fallback = studio.profileImageLarge || studio.profileImageMedium || studio.profileImage;
    const [selectedId, setSelectedId] = useState(gallery[0]?.id);
    const selected = gallery.find((item) => item.id === selectedId) || gallery[0];
    const selectedSource = selected?.largeUrl || selected?.url || fallback;

    return <div className="grid gap-2 bg-[#0d0d0d] p-2 lg:grid-cols-[92px_minmax(0,1fr)]">
        <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col">{gallery.map((item) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition lg:h-[76px] lg:w-[76px] ${selected?.id === item.id ? "border-[#3ea6ff] opacity-100" : "border-transparent opacity-55 hover:opacity-100"}`} aria-label={`Show studio ${item.type.toLowerCase()} ${gallery.indexOf(item) + 1}`}>{item.type === "IMAGE" ? <Image src={item.thumbnailUrl || item.mediumUrl || item.url} alt="" fill sizes="80px" unoptimized className="object-cover" /> : item.thumbnailUrl ? <Image src={item.thumbnailUrl} alt="" fill sizes="80px" unoptimized className="object-cover brightness-75" /> : <video src={item.url} muted playsInline className="h-full w-full object-cover" />}</button>)}{gallery.length === 0 && <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#363636] text-[#555] lg:h-[76px] lg:w-[76px]"><Building2 size={20} /></div>}</div>
        <div className="relative order-1 min-h-[280px] overflow-hidden rounded-2xl bg-[#1b1b1b] sm:min-h-[360px] lg:order-2">{selected ? selected.type === "VIDEO" ? <video key={selected.id} src={selected.url} poster={selected.thumbnailUrl || undefined} controls playsInline className="h-full min-h-[280px] w-full object-contain sm:min-h-[360px]" /> : <Image key={selected.id} src={selectedSource || "/images/beats.png"} alt={`${studio.studioName} studio`} fill sizes="(min-width: 1024px) 75vw, 100vw" unoptimized className="object-cover transition duration-500" /> : <div className="flex h-full min-h-[280px] items-center justify-center"><Building2 size={42} className="text-[#4a4a4a]" /></div>}<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" /><div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">{gallery.length > 0 ? `${(gallery.findIndex((item) => item.id === selected?.id) + 1) || 1} / ${gallery.length}` : "Add gallery photos"}</div></div>
    </div>;
}

function getStudioGallery(studio: Studio): StudioMedia[] {
    const profileImage = studio.profileImageLarge || studio.profileImageMedium || studio.profileImage;
    const profileMedia = profileImage ? [{
        id: "profile-image",
        type: "IMAGE" as const,
        url: profileImage,
        largeUrl: studio.profileImageLarge || profileImage,
        mediumUrl: studio.profileImageMedium || profileImage,
        thumbnailUrl: studio.profileImageThumbnail || profileImage,
        displayOrder: -1,
    }] : [];
    return [...profileMedia, ...(studio.media || [])];
}

function Metric({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
    return <div className="rounded-xl border border-[#2b2b2b] bg-[#101010] px-3 py-3"><p className="text-[10px] uppercase tracking-[0.12em] text-[#666]">{label}</p><p className="mt-2 flex items-center gap-1.5 truncate text-sm font-medium text-[#ddd]">{icon}{value}</p></div>;
}

function StudioMediaManager({ studio, onRefresh }: { studio: Studio; onRefresh: () => Promise<void> }) {
    const [media, setMedia] = useState<StudioMedia[]>(getStudioGallery(studio));
    const [busy, setBusy] = useState(false);
    const [uploading, setUploading] = useState<"image" | "video" | null>(null);
    const [pendingImage, setPendingImage] = useState<File | null>(null);
    const [pendingVideo, setPendingVideo] = useState<File | null>(null);

    useEffect(() => {
        setMedia(getStudioGallery(studio));
    }, [studio]);

    async function removeMedia(item: StudioMedia) {
        if (item.id === "profile-image") return;
        setBusy(true);
        try {
            await StudioService.deleteStudioMedia(studio.id, item.id);
            setMedia((current) => current.filter((entry) => entry.id !== item.id));
            await onRefresh();
            toast.success(item.type === "VIDEO" ? "Studio video removed" : "Gallery photo removed");
        } catch (error) {
            toast.error("Could not remove gallery media", { description: getErrorMessage(error) });
        } finally {
            setBusy(false);
        }
    }

    function selectImage(file: File) {
        if (!isSupportedImage(file)) {
            toast.error("Invalid gallery image", { description: "Use a JPEG, PNG, or WebP image smaller than 5 MB." });
            return;
        }
        if (media.filter((item) => item.type === "IMAGE" && item.id !== "profile-image").length >= 5) {
            toast.error("Gallery limit reached", { description: "A studio can have up to 5 gallery images." });
            return;
        }
        setPendingImage(file);
        setPendingVideo(null);
    }

    async function uploadImage(file: File) {
        setBusy(true);
        setUploading("image");
        try {
            const uploaded = await StudioService.uploadGalleryImage(studio.id, file);
            setMedia((current) => [...current, uploaded]);
            await onRefresh();
            toast.success("Gallery image added");
            setPendingImage(null);
        } catch (error) {
            toast.error("Could not upload gallery image", { description: getErrorMessage(error) });
        } finally {
            setBusy(false);
            setUploading(null);
        }
    }

    function selectVideo(file: File) {
        if (!file.size || file.size > 100 * 1024 * 1024 || !["video/mp4", "video/webm", "video/quicktime"].includes(file.type)) {
            toast.error("Invalid studio video", { description: "Use an MP4, WebM, or MOV video smaller than 100 MB." });
            return;
        }
        if (media.some((item) => item.type === "VIDEO")) {
            toast.error("Video limit reached", { description: "A studio can have only 1 gallery video." });
            return;
        }
        setPendingVideo(file);
        setPendingImage(null);
    }

    async function uploadVideo(file: File) {
        setBusy(true);
        setUploading("video");
        try {
            const uploaded = await StudioService.uploadGalleryVideo(studio.id, file);
            setMedia((current) => [...current, uploaded]);
            await onRefresh();
            toast.success("Studio video added");
            setPendingVideo(null);
        } catch (error) {
            toast.error("Could not upload studio video", { description: getErrorMessage(error) });
        } finally {
            setBusy(false);
            setUploading(null);
        }
    }

    return <>
    <div className="border-t border-[#2b2b2b] bg-[#111111] px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3ea6ff]">Music studio gallery</p>
                <p className="mt-1 text-sm font-medium text-[#e5e5e5]">Manage the media shown in your studio showcase</p>
                <p className="mt-1 text-xs text-[#666]">{media.filter((item) => item.type === "IMAGE" && item.id !== "profile-image").length}/5 photos · {media.some((item) => item.type === "VIDEO") ? "1/1 video" : "0/1 video"}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#363636] bg-[#181818] px-3 py-2 text-xs font-medium text-[#aaa] transition hover:border-[#3ea6ff]/50 hover:text-white">
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) selectImage(file); event.target.value = ""; }} />
                    <ImagePlus size={14} /> Choose photo
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#363636] bg-[#181818] px-3 py-2 text-xs font-medium text-[#aaa] transition hover:border-[#3ea6ff]/50 hover:text-white">
                    <input type="file" accept="video/mp4,video/webm,video/quicktime" className="sr-only" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) selectVideo(file); event.target.value = ""; }} />
                    <Film size={14} /> Choose video
                </label>
            </div>
        </div>
        {(pendingImage || pendingVideo || uploading) && <div className="mt-3 flex min-w-0 items-center gap-2 text-xs">
            <span className="min-w-0 truncate text-[#9aa6b2]">{(pendingImage || pendingVideo)?.name || (uploading === "image" ? "Uploading photo..." : "Uploading video...")}</span>
            {!uploading && <><button type="button" onClick={() => { setPendingImage(null); setPendingVideo(null); }} className="shrink-0 text-[#777] hover:text-white">Cancel</button><button type="button" onClick={() => pendingImage ? void uploadImage(pendingImage) : pendingVideo ? void uploadVideo(pendingVideo) : undefined} className="shrink-0 font-semibold text-[#3ea6ff] hover:text-[#65b8ff]">Upload</button></>}
            {uploading && <span className="inline-flex shrink-0 items-center gap-1 text-[#3ea6ff]"><Loader2 size={13} className="animate-spin" /> Processing</span>}
        </div>}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{media.filter((item) => item.id !== "profile-image").map((item) => <div key={item.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#2b2b2b] bg-[#181818]">{item.type === "IMAGE" ? <Image src={item.thumbnailUrl || item.mediumUrl || item.url} alt="" fill sizes="160px" unoptimized className="object-cover" /> : item.thumbnailUrl ? <Image src={item.thumbnailUrl} alt="" fill sizes="160px" unoptimized className="object-cover brightness-75" /> : <video src={item.url} muted playsInline className="h-full w-full object-cover" />}<span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-1 text-[9px] uppercase tracking-wide text-white">{item.type === "VIDEO" ? "Video" : "Photo"}</span><button type="button" disabled={busy} onClick={() => void removeMedia(item)} aria-label={`Remove ${item.type.toLowerCase()}`} className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-red-200 opacity-100 transition hover:bg-red-400/25 disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"><Trash2 size={13} /></button></div>)}</div>
    </div>
    </>;
}

function getErrorMessage(error: unknown) {
    const responseMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
    return responseMessage || "Check the file and try again.";
}

function StudioForm({ initialValues, editing, saving, onCancel, onSubmit }: { initialValues: StudioFormValues; editing: boolean; saving: boolean; onCancel: () => void; onSubmit: (values: StudioFormValues) => Promise<void> }) {
    const [values, setValues] = useState(initialValues);

    function updateField(field: keyof StudioFormValues, value: string) {
        setValues((current) => ({ ...current, [field]: value }));
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await onSubmit(values);
    }

    return (
        <form onSubmit={submit} className="mt-8 rounded-2xl border border-[#2b2b2b] bg-[#151515] p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-[#2b2b2b] pb-5"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3ea6ff]">{editing ? "Edit listing" : "New listing"}</p><h2 className="mt-2 text-xl font-semibold text-[#f1f1f1]">Tell artists what you offer</h2></div><Building2 className="text-[#555]" size={22} /></div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Studio name" value={values.studioName} required onChange={(value) => updateField("studioName", value)} placeholder="e.g. Northside Audio" />
                <Field label="Location" value={values.location} required onChange={(value) => updateField("location", value)} placeholder="e.g. Westlands, Nairobi" />
                <Field label="Availability" value={values.availability} required onChange={(value) => updateField("availability", value)} placeholder="e.g. Mon-Sat, 8am-10pm" />
                <div className="sm:col-span-2"><StudioServicePackageEditor packagePrice={values.productionPackagePrice} onPackagePriceChange={(productionPackagePrice) => updateField("productionPackagePrice", productionPackagePrice)} value={values.serviceDetails} onChange={(serviceDetails) => setValues((current) => ({ ...current, serviceDetails, services: serviceDetails.filter((item) => item.active).map((item) => item.name).join(", ") }))} /></div>
                <Field label="Listing badge" value={values.badge} onChange={(value) => updateField("badge", value)} placeholder="e.g. Top Rated" />
                <Field label="Genres" value={values.genres} onChange={(value) => updateField("genres", value)} placeholder="Afrobeats, Hip Hop, R&B" />
                <div className="sm:col-span-2"><Field label="Equipment" value={values.equipment} onChange={(value) => updateField("equipment", value)} placeholder="Neumann U87, Apollo x8, Yamaha HS8" hint="Separate items with commas." /></div>
                <Field label="Rooms" type="number" min="0" value={values.rooms} onChange={(value) => updateField("rooms", value)} placeholder="e.g. 3" />
                <Field label="Years active" type="number" min="0" value={values.yearsActive} onChange={(value) => updateField("yearsActive", value)} placeholder="e.g. 8" />
                <Field label="Response time" value={values.responseTime} onChange={(value) => updateField("responseTime", value)} placeholder="e.g. 15 min" />
                <Field label="Next available" value={values.nextAvailable} onChange={(value) => updateField("nextAvailable", value)} placeholder="e.g. Today" />
                <label className="flex items-center gap-3 rounded-xl border border-[#363636] bg-[#101010] px-4 py-3 text-sm text-[#aaa]"><input type="checkbox" checked={values.available} onChange={(event) => setValues((current) => ({ ...current, available: event.target.checked }))} className="h-4 w-4 accent-[#3ea6ff]" />Available for bookings</label>
                <div className="sm:col-span-2"><label className="block text-xs font-medium text-[#aaa]">Studio profile image<span className="ml-2 font-normal text-[#666]">JPEG, PNG, or WebP up to 5 MB.</span><input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => setValues((current) => ({ ...current, profileImage: event.target.files?.[0] }))} /><span className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#3f3f3f] bg-[#101010] px-4 py-3 text-sm text-[#999] transition hover:border-[#3ea6ff]/60 hover:text-[#f1f1f1]"><ImagePlus size={17} className="text-[#3ea6ff]" />{values.profileImage?.name || "Choose a studio image"}</span></label></div>
                <div className="sm:col-span-2"><label className="block text-xs font-medium text-[#aaa]">Description<span className="ml-1 text-[#3ea6ff]">*</span></label><textarea required value={values.description} onChange={(event) => updateField("description", event.target.value)} rows={5} placeholder="Describe the room, equipment, atmosphere, and what makes your studio a good fit." className="mt-2 w-full resize-y rounded-xl border border-[#363636] bg-[#101010] px-4 py-3 text-sm leading-6 text-[#f1f1f1] outline-none transition placeholder:text-[#5f5f5f] focus:border-[#3ea6ff]/70 focus:ring-2 focus:ring-[#3ea6ff]/10" /></div>
            </div>
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#2b2b2b] pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onCancel} className="rounded-xl border border-[#363636] px-4 py-2.5 text-sm font-medium text-[#aaa] transition hover:bg-[#202020] hover:text-white">Cancel</button><button disabled={saving} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3ea6ff] px-5 py-2.5 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff] disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : <><Check size={16} /> {editing ? "Save changes" : "Create studio"}</>}</button></div>
        </form>
    );
}

function StudioPackageForm({ studio, saving, onCancel, onSubmit }: { studio: Studio; saving: boolean; onCancel: () => void; onSubmit: (price: number, services: StudioServiceOffering[]) => Promise<void> }) {
    const [price, setPrice] = useState(studio.productionPackagePrice ? String(studio.productionPackagePrice) : "");
    const [services, setServices] = useState(() => toFormValues(studio).serviceDetails);
    const [submitting, setSubmitting] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const amount = Number(price);
        if (!Number.isInteger(amount) || amount < 1) {
            toast.error("Set a valid package price", { description: "Enter one total price for all services in this package." });
            return;
        }
        if (!services.some((item) => item.active)) {
            toast.error("Select at least one package service");
            return;
        }
        setSubmitting(true);
        try {
            await onSubmit(amount, services);
        } catch {
            toast.error("Could not update production package", { description: "Check your connection and try again." });
        } finally {
            setSubmitting(false);
        }
    }

    return <form onSubmit={(event) => void submit(event)} className="mt-8 rounded-2xl border border-[#2b2b2b] bg-[#151515] p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-[#2b2b2b] pb-5"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3ea6ff]">Package editor</p><h2 className="mt-2 text-xl font-semibold text-[#f1f1f1]">Services and package price</h2><p className="mt-2 max-w-xl text-xs leading-5 text-[#888]">Every selected service is included in one total price. Choose the services you deliver and set the package price artists will pay.</p></div><Building2 className="text-[#555]" size={22} /></div>
        <div className="mt-6"><StudioServicePackageEditor packagePrice={price} onPackagePriceChange={setPrice} value={services} onChange={setServices} /></div>
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#2b2b2b] pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onCancel} className="rounded-xl border border-[#363636] px-4 py-2.5 text-sm font-medium text-[#aaa] transition hover:bg-[#202020] hover:text-white">Cancel</button><button disabled={saving || submitting} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3ea6ff] px-5 py-2.5 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff] disabled:cursor-not-allowed disabled:opacity-60">{saving || submitting ? <><Loader2 size={15} className="animate-spin" /> Saving package...</> : <><Check size={16} /> Save package</>}</button></div>
    </form>;
}

function StudioServicePackageEditor({ packagePrice, onPackagePriceChange, value, onChange }: { packagePrice: string; onPackagePriceChange: (value: string) => void; value: StudioServiceOffering[]; onChange: (value: StudioServiceOffering[]) => void }) {
    const [catalog, setCatalog] = useState<ServiceCatalogItem[]>([]);
    const [custom, setCustom] = useState("");
    const [adding, setAdding] = useState(false);
    const defaultStages = [
        { name: "Beat creation", description: "Build the instrumental and shape the sound." },
        { name: "Recording", description: "Capture the artist's vocal performance." },
        { name: "Mixing", description: "Balance vocals, instruments, and effects." },
        { name: "Mastering", description: "Polish the final track for release." },
    ];
    const isDefaultStage = (name: string) => defaultStages.some((stage) => stage.name.toLowerCase() === name.toLowerCase());
    const stages = defaultStages.map(({ name, description }) => ({
        ...(value.find((item) => isDefaultStage(item.name) && item.name.toLowerCase() === name.toLowerCase())
            ?? { name, active: true, includedInProductionPackage: true, price: null }),
        description,
    }));
    const extras = value.filter((item) => !isDefaultStage(item.name));

    useEffect(() => { void ServiceCatalogService.getCatalog().then((items) => setCatalog(items.filter((item) => item.studioAllowed))).catch(() => undefined); }, []);

    function updateStage(name: string, active: boolean) {
        const current = value.filter((item) => !isDefaultStage(item.name));
        onChange([...current, ...stages.map((item) => item.name === name
            ? { ...item, active, includedInProductionPackage: true, price: null }
            : item)]);
    }

    function toggleExtra(service: ServiceCatalogItem) {
        const exists = extras.some((item) => item.catalogServiceId === service.id || item.name === service.name);
        onChange(exists
            ? value.filter((item) => !(item.catalogServiceId === service.id || item.name === service.name))
            : [...value, { name: service.name, catalogServiceId: service.id, active: true, includedInProductionPackage: true, price: null }]);
    }

    async function addCustom() {
        const name = custom.trim();
        if (!name || value.some((item) => item.name.toLowerCase() === name.toLowerCase())) return;
        setAdding(true);
        try {
            const created = await ServiceCatalogService.addCustomService({ name, category: "Custom" });
            setCatalog((items) => items.some((item) => item.id === created.id) ? items : [created, ...items]);
            onChange([...value, { name: created.name, catalogServiceId: created.id, active: true, includedInProductionPackage: true, price: null }]);
            setCustom("");
        } catch {
            toast.error("Could not add this service to StudioOS");
        } finally {
            setAdding(false);
        }
    }

    return <section className="rounded-2xl border border-[#343434] bg-[#101010] p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-2"><div><p className="text-xs font-semibold text-[#eee]">Services included in the package</p><p className="mt-1 text-[11px] leading-5 text-[#777]">The four numbered stages form the standard release path. Toggle off stages you do not provide; any extra service you select is also included in this package.</p></div><span className="rounded-full border border-[#3ea6ff]/20 bg-[#3ea6ff]/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8acbff]">One package price</span></div>
        <ol aria-label="Full-production stages" className="mt-4 grid gap-2 sm:grid-cols-2">
            {stages.map((stage, index) => <li key={stage.name}>
                <label className={`group flex h-full cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${stage.active ? "border-[#3ea6ff]/30 bg-gradient-to-br from-[#3ea6ff]/[0.08] to-[#151515] hover:border-[#3ea6ff]/50" : "border-[#292929] bg-[#151515] hover:border-[#454545]"}`}>
                    <span aria-hidden="true" className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-xl border font-mono text-xs font-semibold ${stage.active ? "border-[#3ea6ff]/25 bg-[#3ea6ff]/10 text-[#8acbff]" : "border-[#363636] bg-[#1b1b1b] text-[#666]"}`}>
                        0{index + 1}
                        {index < stages.length - 1 && <span className="absolute -bottom-[15px] left-1/2 hidden h-2 border-l border-dashed border-[#3ea6ff]/25 sm:block" />}
                    </span>
                    <span className="min-w-0 flex-1 pt-0.5">
                        <span className="flex items-center justify-between gap-2">
                            <span className={`text-xs font-semibold ${stage.active ? "text-[#f1f1f1]" : "text-[#999]"}`}>{stage.name}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${stage.active ? "bg-[#3ea6ff]/10 text-[#8acbff]" : "bg-white/[0.04] text-[#666]"}`}>{stage.active ? "Included" : "Not offered"}</span>
                        </span>
                        <span className="mt-1 block text-[10px] leading-4 text-[#777]">{stage.description}</span>
                    </span>
                    <input type="checkbox" checked={stage.active} onChange={(event) => updateStage(stage.name, event.target.checked)} aria-label={`${stage.active ? "Remove" : "Include"} ${stage.name} in production package`} className="mt-1 h-4 w-4 shrink-0 accent-[#3ea6ff]" />
                </label>
            </li>)}
        </ol>
        <div className="mt-6 border-t border-[#292929] pt-5"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-semibold text-[#eee]">Add services to this package</p><p className="mt-1 text-[11px] text-[#777]">Selected services are covered by the package price, not charged separately.</p></div><span className="text-[10px] text-[#777]">{extras.filter((item) => item.active).length} selected</span></div>
            <div className="mt-3 flex flex-wrap gap-2">{catalog.filter((service) => !isDefaultStage(service.name)).map((service) => { const selected = extras.some((item) => item.catalogServiceId === service.id || item.name === service.name); return <button key={service.id} type="button" onClick={() => toggleExtra(service)} aria-pressed={selected} className={`rounded-full border px-3 py-1.5 text-[11px] transition ${selected ? "border-[#3ea6ff]/50 bg-[#3ea6ff]/10 text-[#8acbff]" : "border-[#363636] bg-[#151515] text-[#888] hover:border-[#3ea6ff]/40 hover:text-white"}`}>{selected ? "✓ " : "+ "}{service.name}</button>; })}</div>
            {extras.filter((item) => item.active).length > 0 && <ol className="mt-3 flex flex-wrap gap-2">{extras.filter((item) => item.active).map((item, index) => <li key={item.catalogServiceId || item.name} className="inline-flex items-center gap-2 rounded-lg border border-[#303030] bg-[#151515] px-2.5 py-1.5 text-[10px] text-[#bbb]"><span className="font-mono text-[#8acbff]">{String(index + 5).padStart(2, "0")}</span>{item.name}<button type="button" onClick={() => onChange(value.filter((current) => current.name !== item.name))} aria-label={`Remove ${item.name} from package`} className="text-[#777] hover:text-white"><Trash2 size={12} /></button></li>)}</ol>}
            <div className="mt-4 rounded-xl border border-[#363636] bg-[#151515] p-3.5"><label className="block text-[10px] font-semibold uppercase tracking-[0.13em] text-[#888]">One total package price <span className="text-[#3ea6ff]">· KSh</span><input required type="number" min="1" value={packagePrice} onChange={(event) => onPackagePriceChange(event.target.value)} placeholder="e.g. 25,000" className="mt-2 w-full rounded-lg border border-[#363636] bg-[#0d0d0d] px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-[#3ea6ff]/60" /></label><p className="mt-2 text-[10px] text-[#666]">This is the total artists pay for all services selected above.</p></div>
            <div className="mt-3 flex gap-2"><input value={custom} onChange={(event) => setCustom(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void addCustom(); } }} placeholder="Add a custom service to the package" className="min-w-0 flex-1 rounded-xl border border-[#363636] bg-[#151515] px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-[#5f5f5f] focus:border-[#3ea6ff]/70" /><button type="button" disabled={adding || !custom.trim()} onClick={() => void addCustom()} className="rounded-xl border border-[#3f3f3f] px-3.5 py-2.5 text-xs font-semibold text-[#aaa] hover:border-[#3ea6ff]/50 hover:text-white disabled:opacity-50">{adding ? "Adding..." : "Add service"}</button></div>
        </div>
    </section>;
}

function Field({ label, value, onChange, placeholder, required = false, type = "text", min, hint }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; required?: boolean; type?: string; min?: string; hint?: string }) {
    return <label className="block text-xs font-medium text-[#aaa]">{label}{required && <span className="ml-1 text-[#3ea6ff]">*</span>}{hint && <span className="ml-2 font-normal text-[#666]">{hint}</span>}<input required={required} type={type} min={min} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-[#363636] bg-[#101010] px-4 py-3 text-sm text-[#f1f1f1] outline-none transition placeholder:text-[#5f5f5f] focus:border-[#3ea6ff]/70 focus:ring-2 focus:ring-[#3ea6ff]/10" /></label>;
}

function StudioSummary({ studios }: { studios: Studio[] }) {
    const ratedStudios = studios.filter((studio) => studio.averageRating != null);
    const averageRating = ratedStudios.length > 0 ? ratedStudios.reduce((sum, studio) => sum + (studio.averageRating || 0), 0) / ratedStudios.length : 0;
    const reviewCount = studios.reduce((sum, studio) => sum + (studio.totalRatings || 0), 0);

    return <div className="mt-6 grid gap-3 sm:grid-cols-3"><SummaryItem label="Published listings" value={String(studios.length)} /><SummaryItem label="Total reviews" value={String(reviewCount)} /><SummaryItem label="Average rating" value={averageRating ? averageRating.toFixed(1) : "New"} /></div>;
}

function SummaryItem({ label, value }: { label: string; value: string }) {
    return <div className="rounded-2xl border border-[#2b2b2b] bg-[#151515] px-4 py-4"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#666]">{label}</p><p className="mt-2 text-xl font-semibold tracking-tight text-[#f1f1f1]">{value}</p></div>;
}

function EmptyStudioState({ onCreate }: { onCreate: () => void }) {
    return <div className="mt-8 rounded-2xl border border-dashed border-[#3a3a3a] bg-[#151515] px-6 py-14 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3ea6ff]/10 text-[#3ea6ff]"><Sparkles size={21} /></div><h2 className="mt-5 text-lg font-semibold text-[#f1f1f1]">Your studio starts here</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#888]">Add your first listing so artists can discover your space, services, and availability.</p><button type="button" onClick={onCreate} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3ea6ff] px-4 py-2.5 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff]"><Plus size={16} /> Register a studio</button></div>;
}

function toFormValues(studio: Studio): StudioFormValues {
    const stages = ["Beat creation", "Recording", "Mixing", "Mastering"].map((name) => ({ name, active: true, includedInProductionPackage: true, price: null }));
    const serviceDetails = studio.serviceDetails?.length ? studio.serviceDetails : [
        ...stages,
        ...studio.services.filter((name) => !stages.some((stage) => stage.name.toLowerCase() === name.toLowerCase()))
            .map((name) => ({ name, active: true, includedInProductionPackage: false, price: null })),
    ];
    return { studioName: studio.studioName, location: studio.location, pricing: String(studio.pricing), productionPackagePrice: studio.productionPackagePrice ? String(studio.productionPackagePrice) : "", availability: studio.availability, description: studio.description, services: studio.services.join(", "), serviceDetails, badge: studio.badge || "", genres: studio.genres.join(", "), equipment: studio.equipment.join(", "), rooms: studio.rooms == null ? "" : String(studio.rooms), yearsActive: studio.yearsActive == null ? "" : String(studio.yearsActive), responseTime: studio.responseTime || "", available: studio.available, nextAvailable: studio.nextAvailable || "" };
}
