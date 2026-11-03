import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Copy, Link2, LoaderCircle, Plus, RefreshCw, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { enqueueOmniUrl, listOmniIngestJobs, retryOmniJob, rotateIngestToken } from "@/lib/omni-ingest.functions";
import { readyOmniItem } from "@/lib/omni-ingest";
import type { SocialGridItem } from "@/lib/social-grid";

export function OmniIngestPanel({ onAdd, full }: { onAdd: (item: SocialGridItem) => void; full: boolean }) {
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  // This inbox is a secondary editor tool. Poll only while there are unfinished jobs.
  const jobs = useQuery({ queryKey: ["omni-ingest-jobs"], queryFn: () => listOmniIngestJobs(), retry: false,
    refetchInterval: (query) => query.state.data?.some((job) => job.status === "queued" || job.status === "processing") ? 2500 : false });
  const enqueue = useMutation({ mutationFn: () => enqueueOmniUrl({ data: { target_url: url } }),
    onMutate: () => setError(""), onSuccess: async (result) => {
      if (!result.ok) { setError("Importeren lukt momenteel niet."); return; }
      setUrl(""); await jobs.refetch();
    }, onError: () => setError("Controleer de link en probeer opnieuw.") });
  const rotate = useMutation({ mutationFn: () => rotateIngestToken(), onSuccess: (result) => { setToken(result.token); setCopied(false); },
    onError: () => setError("Webhook-token kon niet worden aangemaakt.") });
  const retry = useMutation({ mutationFn: (id: string) => retryOmniJob({ data: { id } }), onSuccess: () => jobs.refetch(),
    onError: () => setError("Opnieuw proberen is momenteel niet beschikbaar.") });

  return <div className="space-y-3 border-b border-border pb-3">
    <form className="flex items-center gap-2" onSubmit={(event) => { event.preventDefault(); enqueue.mutate(); }}>
      <Input aria-label="Content-URL" placeholder="https://…" inputMode="url" value={url} onChange={(event) => setUrl(event.target.value)} />
      <Button type="submit" size="icon" variant="outline" title="Link importeren" aria-label="Link importeren" disabled={!url.trim() || enqueue.isPending || full}>
        {enqueue.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
      </Button>
    </form>
    {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
    {enqueue.isPending && <div role="status" className="h-20 animate-pulse rounded-md bg-muted motion-reduce:animate-none" aria-label="Import wordt aangevraagd" />}
    {jobs.isError && <p role="status" className="text-xs text-muted-foreground">Content-inbox is nog niet beschikbaar.</p>}
    <ul className="space-y-2">
      {jobs.data?.filter((job) => !added.has(job.id)).map((job) => {
        const item = readyOmniItem(job);
        const pending = job.status === "queued" || job.status === "processing";
        return <li key={job.id} className="flex items-center gap-2 rounded-md border border-border p-2">
          {pending ? <div className="h-12 w-12 shrink-0 animate-pulse rounded-md bg-muted motion-reduce:animate-none" /> :
            item ? <img src={item.mediaUrl} alt="" className="h-12 w-12 shrink-0 rounded-md object-cover" /> : <Link2 className="h-5 w-5 shrink-0 text-muted-foreground" />}
          <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{job.title || new URL(job.sourceUrl).hostname}</p>
            <p className="text-[10px] text-muted-foreground" role="status">{pending ? "Wordt verwerkt…" : item ? item.contentType : "Import mislukt"}</p></div>
          {item && <Button variant="ghost" size="icon" aria-label="Kaart toevoegen" title="Kaart toevoegen" disabled={full} onClick={() => { onAdd(item); setAdded((previous) => new Set([...previous, job.id])); }}><Plus className="h-4 w-4" /></Button>}
          {job.status === "failed" && <Button variant="ghost" size="icon" aria-label="Import opnieuw proberen" title="Import opnieuw proberen" disabled={retry.isPending} onClick={() => retry.mutate(job.id)}><RefreshCw className="h-4 w-4" /></Button>}
        </li>;
      })}
    </ul>
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline" disabled={rotate.isPending} onClick={() => rotate.mutate()}><KeyRound className="h-3.5 w-3.5" />{token ? "Token vernieuwen" : "Webhook genereren"}</Button>
      {token && <Button size="icon" variant="ghost" title="Webhook-URL kopiëren" aria-label="Webhook-URL kopiëren" onClick={async () => {
        try { await navigator.clipboard.writeText(`${window.location.origin}/api/public/ingest/omni?token=${encodeURIComponent(token)}`); setCopied(true); }
        catch { setError("Kopiëren is niet beschikbaar in deze browser."); }
      }}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>}
    </div>
  </div>;
}