"use client";

type DeleteDialogProps = {
  titleId: string;
  heading: string;
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

export default function DeleteDialog({
  titleId,
  heading,
  itemName,
  onCancel,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="w-full max-w-sm rounded-2xl border border-gray-700 bg-[#181a21] p-8 text-center shadow-2xl">
        <div className="mb-4 text-5xl" aria-hidden>
          &#9888;&#65039;
        </div>
        <h2 id={titleId} className="mb-2 text-xl font-bold">
          {heading}
        </h2>
        <p className="mb-6 text-gray-400">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">{itemName}</span>? This
          action is irreversible.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="cursor-pointer rounded-lg bg-[#61dca3] px-6 py-2 font-bold text-[#0b0f15] transition hover:bg-[#3fc78d]"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
          <button
            className="cursor-pointer rounded-lg bg-gray-700 px-6 py-2 text-gray-300 transition hover:bg-gray-600"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
