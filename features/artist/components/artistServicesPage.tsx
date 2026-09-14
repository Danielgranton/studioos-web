"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock3, DollarSign, Inbox, MoreHorizontal, PackageCheck, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useDashboardSession } from "@/features/dashboard";

import { ArtistService as ArtistApiService } from "../services/artist.service";
import type { ArtistService, ArtistServiceRequest } from "../types/artist";

type ServiceForm = { name: string; description: string; price: string; currency: string; active: boolean };
type RequestFilter = "PENDING" | "PAID" | "DELIVERED";

const EMPTY_FORM: ServiceForm = { name: "", description: "", price: "", currency: "KES", active: true };

export function ArtistServicesPage() {
    const session = useDashboardSession();
    const router = useRouter();
    const [services, setServices] = useState<ArtistService[] | null>(null);
    const [requests, setRequests] = useState<ArtistServiceRequest[] | null>(null);
    const [editing, setEditing] = useState<ArtistService | null>(null);
    const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [requestFilter, setRequestFilter] = useState<RequestFilter>("PENDING");

    useEffect(() => {
        if (session && session.role !== "ARTIST") router.replace("/dashboard");
    }, [router, session]);

    useEffect(() => {
        if (session?.role !== "ARTIST") return;
        void Promise.all([ArtistApiService.getMyServices(), ArtistApiService.getMyServiceRequests()]).then(([myServices, myRequests]) => { setServices(myServices); setRequests(myRequests); }).catch(() => { setServices([]); setRequests([]); toast.error("Could not load your services workspace"); });
    }, [session]);

    if (session?.role !== "ARTIST") return null;

    function openCreate() {
        setEditing(null);
        setForm(EMPTY_FORM);
        setShowForm(true);
    }

    function openEdit(service: ArtistService) {
        setEditing(service);
        setForm({ name: service.name, description: service.description || "", price: String(service.price), currency: service.currency, active: service.active });
        setShowForm(true);
    }

    async function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const request = { name: form.name.trim(), description: form.description.trim() || undefined, price: Number(form.price), currency: form.currency.trim().toUpperCase() || "KES", active: form.active };
        if (!request.name || !Number.isFinite(request.price) || request.price < 0) { toast.error("Add a service name and valid price"); return; }
        setSaving(true);
        try {
            const saved = editing ? await ArtistApiService.updateService(editing.id, request) : await ArtistApiService.createService(request);
            setServices((current) => editing ? (current || []).map((item) => item.id === saved.id ? saved : item) : [saved, ...(current || [])]);
            setShowForm(false);
            toast.success(editing ? "Service updated" : "Service published");
        } catch { toast.error("Could not save service", { description: "Check the details and try again." }); }
        finally { setSaving(false); }
    }

    async function remove(service: ArtistService) {
        if (!window.confirm(`Remove ${service.name}?`)) return;
        try { await ArtistApiService.deleteService(service.id); setServices((current) => (current || []).filter((item) => item.id !== service.id)); toast.success("Service removed"); }
        catch { toast.error("Could not remove service"); }
    }

    return <div className="mx-auto w-full max-w-6xl p-5 text-[#f1f1f1] sm:p-8 lg:p-10">
        <header className="flex flex-col gap-5 border-b border-[#2b2b2b] pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#3ea6ff]">Artist workspace</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Services</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#888]">Package your creative work with clear prices, then manage every request from one place.</p></div><button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3ea6ff] px-4 py-2.5 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff]"><Plus size={16} /> Add service</button></header>
        <section className="mt-6 grid gap-3 sm:grid-cols-3"><SummaryTile icon={<Inbox size={17} />} label="Published services" value={services?.filter((service) => service.active).length ?? 0} /><SummaryTile icon={<Clock3 size={17} />} label="Pending requests" value={requests?.filter((request) => request.status === "PENDING").length ?? 0} /><SummaryTile icon={<DollarSign size={17} />} label="Paid requests" value={requests?.filter((request) => request.status === "PAID").length ?? 0} /></section>
        {showForm && <ServiceForm form={form} editing={Boolean(editing)} saving={saving} onChange={setForm} onCancel={() => setShowForm(false)} onSubmit={save} />}
        <section className="mt-8"><div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3ea6ff]">Your catalogue</p><h2 className="mt-2 text-lg font-semibold">Services and pricing</h2></div><span className="text-xs text-[#666]">{services?.length ?? 0} total</span></div>{services === null ? <LoadingRows /> : services.length === 0 ? <EmptyState title="Your catalogue is empty" description="Add your first service so artists and collaborators know exactly what you offer." action={openCreate} /> : <div className="mt-4 grid gap-3 md:grid-cols-2">{services.map((service) => <ServiceCard key={service.id} service={service} onEdit={() => openEdit(service)} onDelete={() => void remove(service)} />)}</div>}</section>
        <section className="mt-10"><div className="flex flex-col gap-4 border-b border-[#2b2b2b] pb-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3ea6ff]">Work queue</p><h2 className="mt-2 text-lg font-semibold">Service requests</h2><p className="mt-1 text-sm text-[#777]">Review requests, confirm payment, and deliver completed work.</p></div><div className="flex rounded-xl border border-[#303030] bg-[#151515] p-1">{(["PENDING", "PAID", "DELIVERED"] as RequestFilter[]).map((filter) => <button key={filter} type="button" onClick={() => setRequestFilter(filter)} className={`rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] transition ${requestFilter === filter ? "bg-[#3ea6ff] text-[#0f0f0f]" : "text-[#777] hover:text-[#ddd]"}`}>{filter === "PENDING" ? "Pending" : filter === "PAID" ? "Paid" : "Delivered"}</button>)}</div></div>{requests === null ? <LoadingRows /> : requests.filter((request) => request.status === requestFilter).length > 0 ? <div className="mt-5 grid gap-3 md:grid-cols-2">{requests.filter((request) => request.status === requestFilter).map((request) => <RequestCard key={request.id} request={request} onUpdate={async (status) => { const updated = await ArtistApiService.updateServiceRequest(request.id, status); setRequests((current) => (current || []).map((item) => item.id === updated.id ? updated : item)); }} />)}</div> : <RequestEmptyState filter={requestFilter} />}</section>
    </div>;
}

function ServiceForm({ form, editing, saving, onChange, onCancel, onSubmit }: { form: ServiceForm; editing: boolean; saving: boolean; onChange: (form: ServiceForm) => void; onCancel: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
    return <form onSubmit={onSubmit} className="mt-6 rounded-2xl border border-[#3ea6ff]/30 bg-[#15181c] p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3ea6ff]">{editing ? "Edit service" : "New service"}</p><h2 className="mt-2 text-lg font-semibold">Define the offer</h2></div><button type="button" onClick={onCancel} className="text-xs text-[#777] hover:text-[#ddd]">Cancel</button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Service name" value={form.name} placeholder="Vocal recording, songwriting..." onChange={(name) => onChange({ ...form, name })} /><div className="grid grid-cols-[1fr_90px] gap-3"><Field label="Price" type="number" value={form.price} placeholder="0" onChange={(price) => onChange({ ...form, price })} /><Field label="Currency" value={form.currency} placeholder="KES" onChange={(currency) => onChange({ ...form, currency })} /></div><label className="sm:col-span-2"><span className="text-xs font-medium text-[#aaa]">Description</span><textarea rows={3} value={form.description} placeholder="What does the client receive?" onChange={(event) => onChange({ ...form, description: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#3f3f3f] bg-[#101010] px-3.5 py-2.5 text-sm text-[#f1f1f1] outline-none placeholder:text-[#666] focus:border-[#3ea6ff]/70" /></label><label className="flex items-center gap-3 text-xs text-[#aaa]"><input type="checkbox" checked={form.active} onChange={(event) => onChange({ ...form, active: event.target.checked })} className="h-4 w-4 accent-[#3ea6ff]" /> Publish this service</label></div><div className="mt-5 flex justify-end"><button type="submit" disabled={saving} className="rounded-xl bg-[#3ea6ff] px-5 py-2.5 text-sm font-semibold text-[#0f0f0f] disabled:opacity-60">{saving ? "Saving..." : editing ? "Save changes" : "Publish service"}</button></div></form>;
}

function ServiceCard({ service, onEdit, onDelete }: { service: ArtistService; onEdit: () => void; onDelete: () => void }) {
    return <article className="rounded-2xl border border-[#2b2b2b] bg-[#151515] p-4 transition hover:border-[#3ea6ff]/30"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><h3 className="font-semibold">{service.name}</h3><span className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase ${service.active ? "bg-emerald-400/10 text-emerald-300" : "bg-[#272727] text-[#888]"}`}>{service.active ? "Published" : "Hidden"}</span></div><p className="mt-2 text-sm leading-6 text-[#888]">{service.description || "No description added yet."}</p></div><p className="shrink-0 text-sm font-semibold text-[#f0bd65]">{service.currency} {service.price.toLocaleString()}</p></div><div className="mt-4 flex items-center justify-end gap-2 border-t border-[#2b2b2b] pt-3"><button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 rounded-lg border border-[#3f3f3f] px-3 py-2 text-xs text-[#bbb] hover:border-[#3ea6ff]/50"><Pencil size={13} /> Edit</button><button type="button" onClick={onDelete} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-red-300 hover:bg-red-400/10"><Trash2 size={13} /> Remove</button></div></article>;
}

function RequestEmptyState({ filter }: { filter: RequestFilter }) {
    const copy = filter === "PENDING" ? ["No pending requests", "New client requests will appear here for you to review."] : filter === "PAID" ? ["No paid requests", "Requests move here after the client payment is confirmed."] : ["No delivered work yet", "Completed and delivered services will be tracked here."];
    return <div className="mt-5 flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-[#353535] bg-[#131313] px-6 text-center"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3ea6ff]/10 text-[#3ea6ff]">{filter === "PENDING" ? <Clock3 size={18} /> : filter === "PAID" ? <Check size={18} /> : <PackageCheck size={18} />}</span><h3 className="mt-3 text-sm font-semibold">{copy[0]}</h3><p className="mt-1 text-xs text-[#777]">{copy[1]}</p></div>;
}

function RequestCard({ request, onUpdate }: { request: ArtistServiceRequest; onUpdate: (status: ArtistServiceRequest["status"]) => Promise<void> }) {
    const nextStatus = request.status === "PENDING" ? "PAID" : request.status === "PAID" ? "DELIVERED" : null;
    return <article className="rounded-2xl border border-[#2b2b2b] bg-[#151515] p-4"><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold">{request.serviceName}</h3><p className="mt-1 text-xs text-[#888]">Requested by {request.requesterName}</p></div><span className="text-sm font-semibold text-[#f0bd65]">{request.currency} {request.amount.toLocaleString()}</span></div>{request.requestNote && <p className="mt-4 rounded-xl bg-[#101010] px-3 py-2 text-xs leading-5 text-[#aaa]">{request.requestNote}</p>}<div className="mt-4 flex items-center justify-between gap-3 border-t border-[#2b2b2b] pt-3"><span className="text-[10px] uppercase tracking-[0.12em] text-[#666]">{new Date(request.createdAt).toLocaleDateString()}</span>{nextStatus && <button type="button" onClick={() => void onUpdate(nextStatus)} className="rounded-lg bg-[#3ea6ff] px-3 py-2 text-[10px] font-semibold text-[#0f0f0f]">Mark {nextStatus === "PAID" ? "paid" : "delivered"}</button>}</div></article>;
}

function SummaryTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) { return <div className="flex items-center gap-3 rounded-2xl border border-[#2b2b2b] bg-[#151515] p-4"><span className="text-[#3ea6ff]">{icon}</span><div><p className="text-xl font-semibold">{value}</p><p className="text-[10px] uppercase tracking-[0.14em] text-[#666]">{label}</p></div></div>; }
function Field({ label, value, placeholder, type = "text", onChange }: { label: string; value: string; placeholder: string; type?: string; onChange: (value: string) => void }) { return <label><span className="text-xs font-medium text-[#aaa]">{label}</span><input type={type} min={type === "number" ? "0" : undefined} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#3f3f3f] bg-[#101010] px-3.5 py-2.5 text-sm text-[#f1f1f1] outline-none placeholder:text-[#666] focus:border-[#3ea6ff]/70" /></label>; }
function EmptyState({ title, description, action }: { title: string; description: string; action: () => void }) { return <div className="mt-4 rounded-2xl border border-dashed border-[#353535] bg-[#131313] px-6 py-10 text-center"><MoreHorizontal size={22} className="mx-auto text-[#3ea6ff]" /><h3 className="mt-3 text-sm font-semibold">{title}</h3><p className="mx-auto mt-1 max-w-sm text-xs text-[#777]">{description}</p><button type="button" onClick={action} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3ea6ff] px-4 py-2.5 text-xs font-semibold text-[#0f0f0f]"><Plus size={14} /> Add your first service</button></div>; }
function LoadingRows() { return <div className="mt-4 grid gap-3 md:grid-cols-2"><div className="h-32 animate-pulse rounded-2xl bg-[#181818]" /><div className="h-32 animate-pulse rounded-2xl bg-[#181818]" /></div>; }
