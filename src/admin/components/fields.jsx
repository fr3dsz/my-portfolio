import { Suspense, useId, useRef, useState } from "react";
import { editDocument, useApplyDocumentActions, useClient, useDocument, useEditDocument, useQuery } from "@sanity/sdk-react";
import { Check, FileText, ImagePlus, Plus, Trash2, Upload, X } from "lucide-react";
import { API_VERSION, fileUrl, imageUrl, moveItem, newKey } from "../lib";
import { hintClass, inputClass, labelClass } from "../styles";
import { dragRowClass, useDragReorder } from "../useDragReorder";
import { DragHandle, ReorderControls } from "./Reorder";
import { Button, Skeleton } from "./ui";

// Every *Field here is bound to one path of one document: it reads with
// useDocument and writes the draft with useEditDocument, like the Studio.

const FieldSkeleton = ({ tall }) => <Skeleton className={tall ? "h-28 w-full" : "h-9 w-full"} />;

// Each field suspends while its document loads; this keeps the label in place.
function FieldSuspense({ label, tall, children }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-2">
          {label && <Skeleton className="h-4 w-24" />}
          <FieldSkeleton tall={tall} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export function FieldShell({ id, label, hint, error, children }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      )}
      <div className={label ? "mt-2" : ""}>{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className={hintClass}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

// ── plain text / textarea ────────────────────────────────────────────────

function TextFieldInner({ handle, path, label, hint, placeholder, validate, multiline, rows = 4, type = "text", mono }) {
  const id = useId();
  const { data } = useDocument({ ...handle, path });
  const edit = useEditDocument({ ...handle, path });
  const value = typeof data === "string" ? data : "";
  const error = value ? validate?.(value) : null;
  const Control = multiline ? "textarea" : "input";

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <Control
        id={id}
        type={multiline ? undefined : type}
        rows={multiline ? rows : undefined}
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(event) => edit(event.target.value)}
        className={`${inputClass} ${multiline ? "resize-y leading-relaxed" : ""} ${mono ? "font-mono" : ""}`}
      />
    </FieldShell>
  );
}
export function TextField(props) {
  return (
    <FieldSuspense label={props.label}>
      <TextFieldInner {...props} />
    </FieldSuspense>
  );
}

// ── boolean switch ───────────────────────────────────────────────────────

export function Switch({ id, checked, onChange, label, describedBy }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={describedBy}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-150 ${checked ? "border-status bg-status" : "border-line bg-elevated"}`}
    >
      <span className={`size-3.5 rounded-full bg-ink transition-transform duration-150 ${checked ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
    </button>
  );
}

function ToggleFieldInner({ handle, path, label, hint, defaultValue = false }) {
  const id = useId();
  const { data } = useDocument({ ...handle, path });
  const edit = useEditDocument({ ...handle, path });
  const checked = typeof data === "boolean" ? data : defaultValue;

  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
        {hint && (
          <p id={`${id}-hint`} className={hintClass}>
            {hint}
          </p>
        )}
      </div>
      <Switch id={id} checked={checked} onChange={edit} describedBy={hint ? `${id}-hint` : undefined} />
    </div>
  );
}
export function ToggleField(props) {
  return (
    <FieldSuspense label={props.label}>
      <ToggleFieldInner {...props} />
    </FieldSuspense>
  );
}

// ── list of strings (paragraphs, bullet points) ──────────────────────────

export function StringListEditor({ id, items, onChange, placeholder, multiline, addLabel = "Add item", itemLabel = "item" }) {
  const itemProps = useDragReorder((from, to) => onChange(moveItem(items, from, to)));
  const Control = multiline ? "textarea" : "input";

  return (
    <div className="space-y-2">
      {items.length > 0 && (
        <ol className="space-y-2">
          {items.map((item, index) => (
            <li key={index} {...itemProps(index)} className={`flex items-start gap-2 ${dragRowClass}`}>
              <span className="mt-2.5">
                <DragHandle />
              </span>
              <Control
                id={index === 0 ? id : undefined}
                aria-label={`${itemLabel} ${index + 1}`}
                rows={multiline ? 3 : undefined}
                value={item}
                placeholder={placeholder}
                onChange={(event) => onChange(items.map((current, i) => (i === index ? event.target.value : current)))}
                className={`${inputClass} ${multiline ? "resize-y leading-relaxed" : ""}`}
              />
              <ReorderControls index={index} count={items.length} onMove={(from, to) => onChange(moveItem(items, from, to))} label={`${itemLabel} ${index + 1}`} />
              <Button variant="ghost" size="icon" icon={X} aria-label={`Remove ${itemLabel} ${index + 1}`} onClick={() => onChange(items.filter((_, i) => i !== index))} />
            </li>
          ))}
        </ol>
      )}
      <Button size="sm" icon={Plus} onClick={() => onChange([...items, ""])}>
        {addLabel}
      </Button>
    </div>
  );
}

function StringListFieldInner({ handle, path, label, hint, ...editorProps }) {
  const id = useId();
  const { data } = useDocument({ ...handle, path });
  const edit = useEditDocument({ ...handle, path });
  const items = Array.isArray(data) ? data.filter((item) => typeof item === "string") : [];

  return (
    <FieldShell id={id} label={label} hint={hint}>
      <StringListEditor id={id} items={items} onChange={edit} {...editorProps} />
    </FieldShell>
  );
}
export function StringListField(props) {
  return (
    <FieldSuspense label={props.label} tall>
      <StringListFieldInner {...props} />
    </FieldSuspense>
  );
}

// ── list of objects (socials, education, sections, …) ────────────────────

// `headerExtra` adds controls to an item's header row; `addOptions` ([{ label, newItem }])
// replaces the single add button with one per item kind.
export function ObjectListEditor({ items, onChange, newItem, renderItem, itemTitle, itemLabel = "item", addLabel = "Add item", emptyText, headerExtra, addOptions }) {
  const itemProps = useDragReorder((from, to) => onChange(moveItem(items, from, to)));
  const update = (key, fields) => onChange(items.map((item) => (item._key === key ? { ...item, ...fields } : item)));

  return (
    <div className="space-y-3">
      {items.length === 0 && emptyText && <p className="text-sm text-stone">{emptyText}</p>}
      {items.length > 0 && (
        <ol className="space-y-3">
          {items.map((item, index) => {
            const title = itemTitle(item) || `Untitled ${itemLabel}`;
            return (
              <li key={item._key} {...itemProps(index)} className={`border border-line bg-canvas ${dragRowClass}`}>
                <div className="flex items-center gap-2 border-b border-line px-3 py-1.5">
                  <DragHandle />
                  <span className="min-w-0 flex-1 truncate text-sm text-ink">{title}</span>
                  {headerExtra?.(item, (fields) => update(item._key, fields), items)}
                  <ReorderControls index={index} count={items.length} onMove={(from, to) => onChange(moveItem(items, from, to))} label={title} />
                  <Button variant="ghost" size="icon" icon={Trash2} aria-label={`Remove ${title}`} onClick={() => onChange(items.filter((other) => other._key !== item._key))} />
                </div>
                <div className="space-y-4 p-4">{renderItem(item, (fields) => update(item._key, fields))}</div>
              </li>
            );
          })}
        </ol>
      )}
      {addOptions ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone">{addLabel}:</span>
          {addOptions.map((option) => (
            <Button key={option.label} size="sm" icon={Plus} onClick={() => onChange([...items, { _key: newKey(), ...option.newItem() }])}>
              {option.label}
            </Button>
          ))}
        </div>
      ) : (
        <Button size="sm" icon={Plus} onClick={() => onChange([...items, { _key: newKey(), ...newItem() }])}>
          {addLabel}
        </Button>
      )}
    </div>
  );
}

function ObjectListFieldInner({ handle, path, label, hint, ...editorProps }) {
  const id = useId();
  const { data } = useDocument({ ...handle, path });
  const edit = useEditDocument({ ...handle, path });
  const items = Array.isArray(data) ? data.filter((item) => item?._key) : [];

  return (
    <FieldShell id={id} label={label} hint={hint}>
      <ObjectListEditor items={items} onChange={edit} {...editorProps} />
    </FieldShell>
  );
}
export function ObjectListField(props) {
  return (
    <FieldSuspense label={props.label} tall>
      <ObjectListFieldInner {...props} />
    </FieldSuspense>
  );
}

// Inputs for fields inside a list item (not bound to a document path).
export function InlineInput({ label, value, onChange, placeholder, multiline, mono, error, hint }) {
  const id = useId();
  const Control = multiline ? "textarea" : "input";
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <Control
        id={id}
        rows={multiline ? 3 : undefined}
        value={value ?? ""}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} ${multiline ? "resize-y leading-relaxed" : ""} ${mono ? "font-mono" : ""}`}
      />
    </FieldShell>
  );
}

// ── image & file uploads ────────────────────────────────────────────────

function useUpload(kind) {
  const client = useClient({ apiVersion: API_VERSION });
  const [state, setState] = useState({ busy: false, error: null });

  const upload = async (file) => {
    setState({ busy: true, error: null });
    try {
      const asset = await client.assets.upload(kind, file, { filename: file.name });
      setState({ busy: false, error: null });
      return asset;
    } catch (err) {
      setState({ busy: false, error: err.message || "Upload failed" });
      return null;
    }
  };

  return [upload, state];
}

function ImageFieldInner({ handle, path, label, hint, withAlt, accept = "image/*", previewClass = "aspect-[4/3] w-48" }) {
  const id = useId();
  const inputRef = useRef(null);
  const { data } = useDocument({ ...handle, path });
  const edit = useEditDocument({ ...handle, path });
  const apply = useApplyDocumentActions();
  const [upload, { busy, error }] = useUpload("image");
  const image = data && typeof data === "object" ? data : null;
  const src = imageUrl(image?.asset?._ref, { w: 480 });

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const asset = await upload(file);
    if (asset) edit({ ...image, _type: "image", asset: { _type: "reference", _ref: asset._id } });
  };

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div className="flex flex-wrap items-start gap-4">
        <div className={`flex items-center justify-center overflow-hidden border border-line bg-canvas ${previewClass}`}>
          {src ? <img src={src} alt={image?.alt || ""} className="size-full object-cover" /> : <ImagePlus aria-hidden="true" className="size-5 text-stone" />}
        </div>
        <div className="flex flex-col gap-2">
          <input ref={inputRef} id={id} type="file" accept={accept} onChange={onFile} className="sr-only" />
          <Button size="sm" icon={Upload} loading={busy} onClick={() => inputRef.current?.click()}>
            {src ? "Replace" : "Upload"}
          </Button>
          {src && (
            <Button size="sm" variant="ghost" icon={X} onClick={() => apply(editDocument(handle, { unset: [path] }))}>
              Remove
            </Button>
          )}
        </div>
      </div>
      {withAlt && src && (
        <div className="mt-4 max-w-md">
          <InlineInput label="Alt text" hint="Describe the photo for screen readers." value={image?.alt} onChange={(alt) => edit({ ...image, alt })} />
        </div>
      )}
    </FieldShell>
  );
}
export function ImageField(props) {
  return (
    <FieldSuspense label={props.label} tall>
      <ImageFieldInner {...props} />
    </FieldSuspense>
  );
}

function FileFieldInner({ handle, path, label, hint, accept = "application/pdf" }) {
  const id = useId();
  const inputRef = useRef(null);
  const { data } = useDocument({ ...handle, path });
  const edit = useEditDocument({ ...handle, path });
  const apply = useApplyDocumentActions();
  const [upload, { busy, error }] = useUpload("file");
  const href = fileUrl(data?.asset?._ref);

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const asset = await upload(file);
    if (asset) edit({ _type: "file", asset: { _type: "reference", _ref: asset._id } });
  };

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div className="flex flex-wrap items-center gap-3">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-ink underline decoration-line underline-offset-4 hover:decoration-accent">
            <FileText aria-hidden="true" className="size-4 text-stone" />
            Current file
          </a>
        ) : (
          <span className="text-sm text-stone">No file uploaded</span>
        )}
        <input ref={inputRef} id={id} type="file" accept={accept} onChange={onFile} className="sr-only" />
        <Button size="sm" icon={Upload} loading={busy} onClick={() => inputRef.current?.click()}>
          {href ? "Replace" : "Upload"}
        </Button>
        {href && (
          <Button size="sm" variant="ghost" icon={X} onClick={() => apply(editDocument(handle, { unset: [path] }))}>
            Remove
          </Button>
        )}
      </div>
    </FieldShell>
  );
}
export function FileField(props) {
  return (
    <FieldSuspense label={props.label}>
      <FileFieldInner {...props} />
    </FieldSuspense>
  );
}

// ── tech stack references ───────────────────────────────────────────────

const TECH_QUERY = `*[_type == "techStack"] | order(lower(name) asc) { _id, name, "iconRef": icon.asset._ref }`;

function TechPickerInner({ id, value, onChange }) {
  const { data: tech } = useQuery({ query: TECH_QUERY, perspective: "drafts" });
  const selected = new Set((value || []).map((ref) => ref._ref));

  const toggle = (techId) =>
    onChange(selected.has(techId) ? value.filter((ref) => ref._ref !== techId) : [...(value || []), { _key: newKey(), _type: "reference", _ref: techId }]);

  if (!tech?.length) return <p className="text-sm text-stone">No tech stack items yet. Add some under Tech Stack first.</p>;

  return (
    <ul id={id} className="flex flex-wrap gap-2">
      {tech.map((item) => {
        const isOn = selected.has(item._id);
        const icon = imageUrl(item.iconRef, { w: 32 });
        return (
          <li key={item._id}>
            <button
              type="button"
              aria-pressed={isOn}
              onClick={() => toggle(item._id)}
              className={`inline-flex h-8 cursor-pointer items-center gap-2 border px-2.5 text-xs transition-colors duration-150 ${isOn ? "border-accent bg-accent/15 text-ink" : "border-line text-stone hover:border-stone/60 hover:text-ink"}`}
            >
              {isOn ? <Check aria-hidden="true" className="size-3.5 text-accent" /> : icon ? <img src={icon} alt="" className="size-3.5" /> : null}
              {item.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function TechPicker(props) {
  return (
    <Suspense fallback={<Skeleton className="h-8 w-full" />}>
      <TechPickerInner {...props} />
    </Suspense>
  );
}

function TechRefsFieldInner({ handle, path, label, hint }) {
  const id = useId();
  const { data } = useDocument({ ...handle, path });
  const edit = useEditDocument({ ...handle, path });
  return (
    <FieldShell id={id} label={label} hint={hint}>
      <TechPicker id={id} value={Array.isArray(data) ? data : []} onChange={edit} />
    </FieldShell>
  );
}
export function TechRefsField(props) {
  return (
    <FieldSuspense label={props.label}>
      <TechRefsFieldInner {...props} />
    </FieldSuspense>
  );
}
