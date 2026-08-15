function initials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "?";
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    const letters = parts.length > 1 ? [parts[0][0], parts[parts.length - 1][0]] : [parts[0][0]];
    return letters.join("").toUpperCase();
  }
  return source[0]?.toUpperCase() ?? "?";
}

export function UserAvatar({
  name,
  email,
  image,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name ?? email ?? "User"}
        className="block h-8 w-8 rounded-full border border-amber-200 object-cover"
      />
    );
  }

  return (
    <div
      title={name ?? email ?? undefined}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-200 bg-amber-100 text-xs font-medium text-amber-700"
    >
      {initials(name, email)}
    </div>
  );
}
