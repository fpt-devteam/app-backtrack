import type { Handover } from "@/src/features/handover/types";

export type HandoverViewerRole = "Finder" | "Owner" | "Unknown";
export type HandoverParticipant = Handover["finder"];

export function getHandoverViewerRole(
  handover: Handover,
  currentUserId?: string,
): HandoverViewerRole {
  if (!currentUserId) return "Unknown";
  if (handover.finder?.id === currentUserId) return "Finder";
  if (handover.owner?.id === currentUserId) return "Owner";
  return "Unknown";
}

/**
 * Returns the viewer's counterpart only when the viewer role is known.
 * If the current user has not resolved yet, return null rather than guess.
 */
export function getHandoverCounterpart(
  handover: Handover,
  currentUserId?: string,
): HandoverParticipant {
  const role = getHandoverViewerRole(handover, currentUserId);
  if (role === "Finder") return handover.owner;
  if (role === "Owner") return handover.finder;
  return null;
}

export function getHandoverTitle(handover: Handover): string {
  const finderName = handover.finderPost?.postTitle;
  const ownerName = handover.ownerPost?.postTitle;
  if (finderName && ownerName) return `${finderName} ↔ ${ownerName}`;
  if (finderName) return `Found: ${finderName}`;
  if (ownerName) return `Lost: ${ownerName}`;
  return "Handover";
}

export function getViewerRoleContext(
  handover: Handover,
  currentUserId?: string,
): string {
  const role = getHandoverViewerRole(handover, currentUserId);
  if (role === "Finder") return "You found this item";
  if (role === "Owner") return "You lost this item";
  return "Handover in progress";
}

export function getHandoverStatusLabel(status: Handover["status"]): string {
  switch (status) {
    case "Ongoing":
      return "On going";
    case "Delivered":
      return "Awaiting confirmation";
    case "Confirmed":
      return "Completed";
    case "Rejected":
      return "Rejected";
    case "Closed":
      return "Closed";
    default:
      return "Handover";
  }
}

export function getHandoverNextStep(
  handover: Handover,
  currentUserId?: string,
): string {
  const role = getHandoverViewerRole(handover, currentUserId);

  if (handover.status === "Ongoing" && role === "Finder") {
    return "Next: hand the item over to the owner";
  }

  if (handover.status === "Ongoing" && role === "Owner") {
    return "Waiting for finder to deliver the item";
  }

  if (handover.status === "Delivered" && role === "Finder") {
    return "Waiting for owner to confirm receipt";
  }

  if (handover.status === "Delivered" && role === "Owner") {
    return "Next: confirm you received the item";
  }

  if (handover.status === "Confirmed") {
    return "Completed";
  }

  if (handover.status === "Closed") {
    return "This handover was closed due to a mismatch";
  }

  if (handover.status === "Rejected") {
    return "Request was declined";
  }

  return "Review handover details";
}

export function getHandoverDetailGuidance(
  handover: Handover,
  currentUserId?: string,
): string {
  const role = getHandoverViewerRole(handover, currentUserId);

  if (handover.status === "Ongoing" && role === "Finder") {
    return "You found this item. Once you hand it back to the owner, mark it as delivered so they can confirm receipt.";
  }

  if (handover.status === "Ongoing" && role === "Owner") {
    return "You are waiting for the finder to hand the item over. You will be able to confirm receipt once delivery is marked.";
  }

  if (handover.status === "Delivered" && role === "Finder") {
    return "You marked this as delivered. The owner can now confirm receipt to complete the handover.";
  }

  if (handover.status === "Delivered" && role === "Owner") {
    return "The finder marked this as delivered. Review the details, then confirm if you received the item.";
  }

  if (handover.status === "Confirmed") {
    return "This handover is complete and the item has been successfully returned.";
  }

  if (handover.status === "Closed") {
    return "This handover was closed because the items did not match.";
  }

  if (handover.status === "Rejected") {
    return "This handover request was declined and is no longer active.";
  }

  return "Review the handover details and follow the next step below.";
}
