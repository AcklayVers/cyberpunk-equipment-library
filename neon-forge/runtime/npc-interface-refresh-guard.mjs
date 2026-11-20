/**
 * Return true when a Foundry document hook belongs to this client.
 * Hooks without a userId are treated as local for compatibility with direct/manual calls.
 */
export function isOriginatingClient(currentUserId, eventUserId) {
  return !eventUserId || !currentUserId || eventUserId === currentUserId;
}

/**
 * Check whether the current user can update an Actor document (including a synthetic Actor/ActorDelta).
 * Prefer Foundry's own permission API when it is available; fall back to the prepared isOwner flag.
 */
export function canUpdateActorDocument(actor, user) {
  if (!actor || !user) return false;
  if (user.isGM === true) return true;

  if (typeof actor.canUserModify === "function") {
    try {
      return actor.canUserModify(user, "update") === true;
    } catch {
      return false;
    }
  }

  return actor.isOwner === true;
}
