export function IsAdmin(user: any) {

  if (user.role !== "admin") {
    throw new Error(
      "Only admins are allowed"
    );
  }

  return true;
}